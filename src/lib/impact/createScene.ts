import * as THREE from "three";
import { AI_FLOW, LAPTOP_PHOTO, TECH } from "@/data/impact";
import { BANNERS } from "./banners";
import { createStudioEnv } from "@/lib/plus/createPlusMesh";
import { createLaptop } from "./laptop";
import { createPhotoLaptop } from "./laptopPhoto";
import { FONT, labelTile, makeTexture, pill, roundRect, techTile } from "./canvas";

type Side = 1 | -1;

interface Station {
  group: THREE.Group;
  z: number;
  side: Side;
  index: number;
  spin: boolean;
  /** footprint in world units – used to shrink the object so it always fits a narrow phone screen */
  w: number;
  h: number;
  /** upper scale limit on phones (a wide carousel may be scaled UP so its front card is readable) */
  max: number;
}

export interface Pointer { x: number; y: number }

export interface ImpactScene {
  /** t = scroll progress 0..1 (smoothed), velocity = |target - t| */
  render(t: number, time: number, pointer: Pointer, velocity: number): void;
  resize(): void;
  dispose(): void;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const DECOR_COLORS = [0xb6f02a, 0xf26b4f, 0xa58bff, 0x6a8bff, 0xff7ac8];

const std = (color: number, roughness = 0.5, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

export function createImpactScene(canvas: HTMLCanvasElement): ImpactScene {
  /* ---------- renderer / camera / lights ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 800 ? 1.5 : 2));
  let env: THREE.Texture | null = null;
  try { env = createStudioEnv(renderer); } catch { /* optional: flat lighting fallback */ }
  // Keep the canvas transparent so the portfolio's CSS gradient remains visible.
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.background = null;

  // Fade distant 3D geometry into the page's near-white center.
  // This hides the hard horizon where the floor meets the background.
  scene.fog = new THREE.Fog(0xfbfaff, 14, 58);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  scene.add(camera);
  scene.add(new THREE.AmbientLight(0xffffff, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(2, 3, 2);
  camera.add(key);
  const lime = new THREE.PointLight(0xb6f02a, 40, 25);
  lime.position.set(-3, -1, -2);
  camera.add(lime);
  const violet = new THREE.PointLight(0xa58bff, 35, 25);
  violet.position.set(3, 2, -2);
  camera.add(violet);

  /* ---------- camera path ---------- */
  const curve = new THREE.CatmullRomCurve3(
    ([[0, 0.2, 8], [0.8, 0.4, -6], [-0.8, 0, -22], [0.6, 0.3, -38], [-0.6, 0, -54], [0, 0.2, -70]] as const)
      .map(([x, y, z]) => new THREE.Vector3(x, y, z))
  );

  /* ---------- environment: grid + dust ---------- */
  // Soft pastel floor: retain a visible base, but keep its grid much
  // quieter than the original checkerboard so it blends with the page grid.
  const ck = document.createElement("canvas");
  ck.width = ck.height = 128;
  const cx = ck.getContext("2d")!;

  // Near-white lavender base with only a very slight checker variation.
cx.fillStyle = "#e5defa";
cx.fillRect(0, 0, 128, 128);

cx.fillStyle = "#dcd3f5";
cx.fillRect(0, 0, 64, 64);
cx.fillRect(64, 64, 64, 64);

  // Fine, low-contrast tile edges.
  cx.strokeStyle = "#cec3e9";
  cx.lineWidth = 1;
  cx.strokeRect(0.5, 0.5, 127, 127);
  cx.beginPath();
  cx.moveTo(64, 0);
  cx.lineTo(64, 128);
  cx.moveTo(0, 64);
  cx.lineTo(128, 64);
  cx.stroke();

  const ckTex = new THREE.CanvasTexture(ck);
  ckTex.colorSpace = THREE.SRGBColorSpace;
  ckTex.wrapS = ckTex.wrapT = THREE.RepeatWrapping;
  ckTex.repeat.set(50, 50);
  ckTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const floorMaterial = new THREE.MeshBasicMaterial({
    map: ckTex,
    fog: true,
    side: THREE.DoubleSide,
  });

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    floorMaterial
  );

  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -3.5, -40);
  scene.add(floor);

  const dust = new Float32Array(900);
  for (let i = 0; i < 900; i += 3) {
    dust[i] = (Math.random() - 0.5) * 24;
    dust[i + 1] = (Math.random() - 0.5) * 14;
    dust[i + 2] = 10 - Math.random() * 100;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x8b7cf6, size: 0.07, transparent: true, opacity: 0.7 })));

  /* ---------- floating decor shapes ---------- */
  const decor: THREE.Mesh[] = [];
  const decorGeos: THREE.BufferGeometry[] = [
    new THREE.TorusGeometry(0.7, 0.22, 16, 40),
    new THREE.IcosahedronGeometry(0.8, 0),
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.OctahedronGeometry(0.8),
    new THREE.TorusKnotGeometry(0.5, 0.18, 80, 12),
    new THREE.BoxGeometry(0.9, 0.9, 0.9),
  ];
  const addDecor = (g: number, c: number, x: number, y: number, z: number, s: number) => {
    const m = new THREE.Mesh(
      decorGeos[g],
      new THREE.MeshStandardMaterial({ color: DECOR_COLORS[c], roughness: 0.35, metalness: 0.1, flatShading: g === 1 || g === 3 })
    );
    m.position.set(x, y, z);
    m.scale.setScalar(s);
    m.userData = { r: Math.random() * 0.6 + 0.2, p: Math.random() * 6, y };
    scene.add(m);
    decor.push(m);
  };
  addDecor(0, 0, -3.6, 1.4, 0, 1.3);
  addDecor(1, 1, 3.8, -0.8, -1, 1.4);
  addDecor(2, 2, -3, -1.8, -4, 1.2);
  addDecor(4, 3, 3.6, 1.9, -6, 1.3);
  addDecor(3, 0, -4.4, 0.2, -9, 1.1);
  addDecor(5, 4, 4.2, -1.6, -9, 1);
  for (let q = 0; q < 9; q++) {
    const sd = q % 2 ? 1 : -1;
    addDecor(q % 6, q % 5, sd * (10.5 + Math.random() * 3), (Math.random() - 0.4) * 5, -16 - q * 7, 0.8 + Math.random() * 0.5);
  }

  /* ---------- stations ---------- */
  const stations: Station[] = [];
  const animators: Array<(time: number) => void> = [];
  const addStation = (index: number, z: number, side: Side, group: THREE.Group, spin = false, dims: [number, number] = [5, 4], maxScale = 1) => {
    group.scale.setScalar(0.001);
    scene.add(group);
    stations.push({ group, z, side, index, spin, w: dims[0], h: dims[1], max: maxScale });
  };

  /* 1 · realistic laptop (lib/impact/laptop.ts) – or your own photo via LAPTOP_PHOTO */
  {
    const lap = LAPTOP_PHOTO ? createPhotoLaptop(LAPTOP_PHOTO) : createLaptop(env);
    animators.push(lap.update);
    addStation(1, -13, 1, lap.group, false, [4.8, 3.6]);
  }

  /* 2 · growth stairs */
  {
    const g = new THREE.Group();
    ["2023", "2024", "2025", "NOW"].forEach((label, i) => {
      const hg = 0.8 + i * 0.75;
      const last = i === 3;
      const side = std(0xdcd7f5, 0.5);
      const front = new THREE.MeshBasicMaterial({
        map: makeTexture(128, 128, (x, w, h) => {
          x.fillStyle = last ? "#b6f02a" : "#ebe8fb"; x.fillRect(0, 0, w, h);
          x.fillStyle = "#111"; x.font = `bold 30px ${FONT}`; x.textAlign = "center"; x.fillText(label, w / 2, h - 14);
        }),
      });
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.1, hg, 1.1), [side, side, std(last ? 0xb6f02a : 0xf2f0fd), side, front, side]);
      m.position.set(-1.95 + i * 1.3, -1.5 + hg / 2, 0);
      g.add(m);
    });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), std(0xf26b4f, 0.3));
    g.add(ball);
    animators.push((T) => ball.position.set(1.95, 1.9 + Math.abs(Math.sin(T * 2.2)) * 0.7, 0));
    addStation(2, -29, -1, g, false, [5.4, 3.4]);
  }

  /* 3 · real business banners as a "matrix": 3 columns × 3 rows (lib/impact/banners.ts) */
  {
    const g = new THREE.Group();
    const COLS = 3, CW = 1.5, CH = 0.99, GX = 1.64, GY = 1.14;
    const cards: THREE.Mesh[] = [];
    // dark backplate with cell lines → "video wall / matrix" feel
    const plate = new THREE.Mesh(
      new THREE.PlaneGeometry(COLS * GX + 0.2, 3 * GY + 0.2),
      new THREE.MeshBasicMaterial({
        transparent: true, opacity: 0.94,
        map: makeTexture(512, 384, (x, w, h) => {
          x.fillStyle = "#12132b"; roundRect(x, 0, 0, w, h, 26); x.fill();
          x.strokeStyle = "#2b2e5c"; x.lineWidth = 2;
          for (let i = 1; i < 3; i++) { x.beginPath(); x.moveTo((w / 3) * i, 14); x.lineTo((w / 3) * i, h - 14); x.moveTo(14, (h / 3) * i); x.lineTo(w - 14, (h / 3) * i); x.stroke(); }
        }),
      })
    );
    plate.position.z = -0.06;
    g.add(plate);
    BANNERS.forEach((b, i) => {
      const col = i % COLS, row = Math.floor(i / COLS);
      const map = makeTexture(640, 420, (x) => { x.save(); roundRect(x, 0, 0, 640, 420, 22); x.clip(); b.paint(x); x.restore(); });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), new THREE.MeshBasicMaterial({ map, transparent: true }));
      m.position.set((col - 1) * GX, (1 - row) * GY, 0);
      m.userData = { i, col, row };
      g.add(m);
      cards.push(m);
    });
    const labels = BANNERS.map((b) => makeTexture(420, 64, (x, w, h) => {
      x.fillStyle = "#111111"; roundRect(x, 2, 2, w - 4, h - 4, 30); x.fill();
      x.fillStyle = "#b6f02a"; x.font = `700 26px ${FONT}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(b.label, w / 2, h / 2 + 1);
    }));
    const tag = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.29), new THREE.MeshBasicMaterial({ map: labels[0], transparent: true }));
    tag.position.set(0, 2.1, 0.1);                      // above the matrix → never overlaps the text
    g.add(tag);
    let shown = 0;
    animators.push((T) => {
      const active = Math.floor(T / 1.8) % BANNERS.length;   // scanning highlight moves through the matrix
      cards.forEach((m) => {
        const u = m.userData as { i: number; col: number; row: number };
        const on = u.i === active;
        m.position.z += ((on ? 0.3 : 0) + Math.sin(T * 1.2 + u.col * 0.9 + u.row * 0.6) * 0.03 - m.position.z) * 0.12;
        m.scale.setScalar(m.scale.x + ((on ? 1.1 : 1) - m.scale.x) * 0.12);
        (m.material as THREE.MeshBasicMaterial).opacity += ((on ? 1 : 0.8) - (m.material as THREE.MeshBasicMaterial).opacity) * 0.12;
      });
      if (active !== shown) { shown = active; (tag.material as THREE.MeshBasicMaterial).map = labels[active]; }
    });
    addStation(3, -45, 1, g, false, [4.9, 4.0]);
  }

  /* 4 · technology globe (23 tiles from data/impact.ts) */
  {
    const g = new THREE.Group();
    const n = TECH.length;
    const R = 2.6;
    TECH.forEach((t, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const rd = Math.sqrt(1 - y * y);
      const th = i * 2.399963;
      const m = techTile(t);
      m.position.set(Math.cos(th) * rd * R, y * R, Math.sin(th) * rd * R);
      m.lookAt(m.position.clone().multiplyScalar(2));
      g.add(m);
    });
    g.add(new THREE.Mesh(new THREE.SphereGeometry(R - 0.2, 24, 18), new THREE.MeshBasicMaterial({ color: 0xe6e2f7, transparent: true, opacity: 0.55 })));
    addStation(4, -61, -1, g, true, [5.4, 5.4]);
  }

  /* 5 · RAG / AI-agent pipeline (data/impact.ts → AI_FLOW) */
  {
    const g = new THREE.Group();
    const spots: Array<[number, number]> = [[-1.95, 1.25], [-0.65, 1.25], [0.65, 1.25], [1.95, 1.25], [1.95, -1.25], [0.65, -1.25], [-0.65, -1.25]];
    AI_FLOW.forEach((tech, i) => {
      const card = techTile(tech);
      card.position.set(spots[i][0], spots[i][1], 0);
      g.add(card);
      const badge = labelTile(String(i + 1), "#111111", "#b6f02a", 0.3);
      badge.position.set(spots[i][0] - 0.46, spots[i][1] + 0.56, 0.03);
      g.add(badge);
    });

    const path = new THREE.CatmullRomCurve3(spots.map(([x, y]) => new THREE.Vector3(x, y, -0.06)), false, "catmullrom", 0.1);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(path, 160, 0.025, 8, false), new THREE.MeshBasicMaterial({ color: 0x8b7cf6 })));

    const pulses = Array.from({ length: 6 }, () => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshBasicMaterial({ color: 0xb6f02a }));
      g.add(m);
      return m;
    });
    const vec = pill("[0.12, −0.84, 0.47, …]", "#e9e4ff", "#4b3fb8", 2.1);
    vec.position.set(-0.65, 2.2, 0.05);
    g.add(vec);
    const cap = pill("retrieve → augment → generate", "#111111", "#b6f02a", 2.7);
    cap.position.set(0, -2.3, 0.05);
    g.add(cap);

    animators.push((T) => {
      pulses.forEach((m, i) => { m.position.copy(path.getPointAt((T * 0.12 + i / 6) % 1)); m.position.z = -0.03; });
      vec.position.y = 2.2 + Math.sin(T * 1.4) * 0.06;
    });
    addStation(5, -77, 1, g, false, [5.2, 5.4]);
  }

  /* ---------- sizing ---------- */
  let portrait = false;
  let baseFov = 55;
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    portrait = w < 800;
    baseFov = portrait ? 68 : 55;          // wider lens on phones so the 3D props fit
  };
  resize();

  /* ---------- per-frame ---------- */
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();
  const tan = new THREE.Vector3();

  const render: ImpactScene["render"] = (t, time, pointer, velocity) => {
    curve.getPoint(t, pos);
    camera.position.copy(pos);
    camera.position.x += pointer.x * 0.8;
    camera.position.y -= pointer.y * 0.5;
    curve.getTangent(t, tan);
    look.copy(pos).add(tan);
    camera.lookAt(look);
    camera.rotateZ(Math.sin(t * 14) * 0.035);

    // speed-boost feel: FOV stretches while scrolling fast
    camera.fov += (baseFov + clamp(velocity * 600, 0, 22) - camera.fov) * 0.1;
    camera.updateProjectionMatrix();

    decor.forEach((m) => {
      const u = m.userData as { r: number; p: number; y: number };
      m.rotation.x = time * u.r;
      m.rotation.y = time * u.r * 0.8;
      m.position.y = u.y + Math.sin(time * 0.8 + u.p) * 0.25;
    });

    const ldz = look.z - camera.position.z;
    stations.forEach(({ group, z, side, index, spin, w, h, max }) => {
      const near = Math.abs(t - index / 5) < 0.15;
      // phones: scale each prop to the visible width/height at its distance (never clipped at the edges)
      const fit = portrait ? clamp(Math.min((14 * Math.tan((baseFov * Math.PI) / 360) * camera.aspect * 0.92) / w, 4.2 / h), 0.35, max) : 1;
      const target = near ? fit : 0.001;
      group.scale.setScalar(group.scale.x + (target - group.scale.x) * 0.07);
      if (portrait) {
        // phones: centre every prop on the camera's view axis (the camera path sways left/right)
        const k = ldz ? (z - camera.position.z) / ldz : 0;
        group.position.set(
          camera.position.x + (look.x - camera.position.x) * k,
          camera.position.y + (look.y - camera.position.y) * k + 1.7,
          z
        );
      } else group.position.set(side * 3.4, 0, z);
      if (spin) group.rotation.y = time * 0.3;
      else {
        group.rotation.y = (portrait ? 0 : -side * 0.3) + Math.sin(time * 0.5 + index) * (portrait ? 0.1 : 0.25);
        group.rotation.x = Math.sin(time * 0.4 + index) * 0.05;
      }
      group.rotation.y += (1 - clamp(group.scale.x / fit, 0, 1)) * Math.PI * 2 * side; // pop-in spin ends exactly at the target scale
    });
    animators.forEach((fn) => fn(time));
    renderer.render(scene, camera);
  };

  const dispose = () => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh && !(o as THREE.Points).isPoints && !(o as THREE.LineSegments).isLineSegments) return;
      (o as THREE.Mesh).geometry?.dispose();
      const mats = (o as THREE.Mesh).material;
      (Array.isArray(mats) ? mats : [mats]).forEach((m) => {
        (m as THREE.MeshBasicMaterial).map?.dispose();
        m?.dispose();
      });
    });
    env?.dispose();
    renderer.dispose();
  };

  return { render, resize, dispose };
}