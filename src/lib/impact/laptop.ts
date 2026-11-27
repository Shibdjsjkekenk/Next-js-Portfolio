import * as THREE from "three";

/**
 * A realistic laptop (not a cartoon box): machined-aluminium body with studio reflections, black key-well with a full
 * keyboard + trackpad + speaker grills, thin black bezel, glossy glass with a soft glare, and a macOS-style screen that
 * shows the portfolio website. Everything is generated – no image files needed.
 * (Want a real photo instead? set LAPTOP_PHOTO in data/impact.ts.)
 */
const LF = "'DM Sans', system-ui, sans-serif";

function lpPath(x: CanvasRenderingContext2D, a: number, b: number, w: number, h: number, r: number) {
  x.beginPath();
  x.moveTo(a + r, b);
  x.arcTo(a + w, b, a + w, b + h, r);
  x.arcTo(a + w, b + h, a, b + h, r);
  x.arcTo(a, b + h, a, b, r);
  x.arcTo(a, b, a + w, b, r);
  x.closePath();
}
function lpFill(x: CanvasRenderingContext2D, a: number, b: number, w: number, h: number, r: number, fill: string) {
  lpPath(x, a, b, w, h, r);
  x.fillStyle = fill;
  x.fill();
}
function lpText(x: CanvasRenderingContext2D, s: string, px: number, py: number, size: number, color: string, weight: number = 600, align: CanvasTextAlign = "left") {
  x.font = `${weight} ${size}px ${LF}`;
  x.fillStyle = color;
  x.textAlign = align;
  x.textBaseline = "middle";
  x.fillText(s, px, py);
}
function lpCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}
function lpTexture(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ---------- screen: macOS-like desktop with the portfolio website open ---------- */
function paintScreen(x: CanvasRenderingContext2D) {
  const W = 1024, H = 640;
  const bg = x.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0b1020");
  bg.addColorStop(0.55, "#1d1450");
  bg.addColorStop(1, "#3b1a5e");
  x.fillStyle = bg;
  x.fillRect(0, 0, W, H);
  const blobs = [[160, 500, 280], [880, 130, 300], [520, 40, 230]];
  const blobCols = ["rgba(182,240,42,.38)", "rgba(255,26,153,.32)", "rgba(25,167,255,.34)"];
  blobs.forEach((b, i) => {
    const g = x.createRadialGradient(b[0], b[1], 0, b[0], b[1], b[2]);
    g.addColorStop(0, blobCols[i]);
    g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);
  });

  // menu bar
  x.fillStyle = "rgba(10,10,25,.55)";
  x.fillRect(0, 0, W, 30);
  lpText(x, "Tiwari", 70, 15, 14, "#ffffff", 800);
  ["File", "Edit", "View", "Window", "Help"].forEach((s, i) => lpText(x, s, 140 + i * 58, 15, 13, "#e5e7f5", 500));
  lpText(x, "Mon 9:41", W - 24, 15, 13, "#ffffff", 600, "right");

  // browser window
  x.save();
  x.shadowColor = "rgba(0,0,0,.5)";
  x.shadowBlur = 44;
  x.shadowOffsetY = 20;
  lpFill(x, 74, 62, 876, 470, 16, "#ffffff");
  x.restore();
  lpFill(x, 74, 62, 876, 40, 16, "#eceaf7");
  x.fillStyle = "#eceaf7";
  x.fillRect(74, 84, 876, 18);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    x.beginPath();
    x.arc(98 + i * 20, 82, 6, 0, Math.PI * 2);
    x.fillStyle = c;
    x.fill();
  });
  lpFill(x, 300, 71, 420, 22, 11, "#ffffff");
  lpText(x, "techwithtiwari.dev", 510, 82, 12, "#6b6b86", 500, "center");

  // site
  lpText(x, "TIWARI", 104, 132, 18, "#111111", 800);
  ["Work", "About", "Stack", "Contact"].forEach((s, i) => lpText(x, s, 640 + i * 70, 132, 13, "#555566", 600));
  lpFill(x, 104, 168, 128, 26, 13, "#f1ffd0");
  lpText(x, "✨ Open to work", 168, 181, 12, "#4d7a00", 700, "center");
  lpText(x, "Full-Stack &", 104, 232, 54, "#111111", 800);
  lpText(x, "AI Developer", 104, 290, 54, "#111111", 800);
  lpText(x, "I build scalable web apps with modern", 104, 338, 15, "#6b7280", 500);
  lpText(x, "technologies and AI-powered solutions.", 104, 360, 15, "#6b7280", 500);
  lpFill(x, 104, 386, 168, 40, 20, "#b6f02a");
  lpText(x, "View projects →", 188, 406, 14, "#111111", 800, "center");
  lpFill(x, 284, 386, 118, 40, 20, "#f3f4f6");
  lpText(x, "Contact", 343, 406, 14, "#111111", 700, "center");
  [["3.2", "Years"], ["12", "Projects"], ["20", "Tech"]].forEach((s, i) => {
    lpText(x, s[0], 104 + i * 110, 466, 26, "#111111", 800);
    lpText(x, s[1].toUpperCase(), 104 + i * 110, 492, 10, "#9ca3af", 600);
  });
  lpFill(x, 566, 160, 350, 340, 18, "#12121f");
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    x.beginPath();
    x.arc(590 + i * 18, 184, 5, 0, Math.PI * 2);
    x.fillStyle = c;
    x.fill();
  });
  const code = [[0, 0.5, "#a58bff"], [1, 0.7, "#b6f02a"], [1, 0.4, "#ff7ac8"], [2, 0.62, "#6a8bff"], [2, 0.46, "#ffffff"], [1, 0.58, "#b6f02a"], [0, 0.3, "#a58bff"], [1, 0.66, "#6a8bff"], [2, 0.42, "#ff7ac8"], [1, 0.52, "#b6f02a"], [0, 0.38, "#a58bff"], [1, 0.6, "#ffd23f"]];
  code.forEach((l, i) => lpFill(x, 590 + (l[0] as number) * 26, 214 + i * 23, (l[1] as number) * 290, 9, 4, l[2] as string));

  // dock
  lpFill(x, 296, 566, 432, 56, 18, "rgba(255,255,255,.22)");
  ["#ff5f57", "#febc2e", "#28c840", "#19a7ff", "#a58bff", "#ff7ac8", "#b6f02a"].forEach((c, i) => lpFill(x, 312 + i * 58, 574, 42, 42, 11, c));

  // camera notch
  lpFill(x, 452, -10, 120, 30, 12, "#000000");
  x.beginPath();
  x.arc(512, 8, 4, 0, Math.PI * 2);
  x.fillStyle = "#0e1a33";
  x.fill();
}

/* ---------- top deck: aluminium palm rest, key well with keys, trackpad, speaker grills ---------- */
function paintDeck(x: CanvasRenderingContext2D) {
  const W = 1024, H = 672;
  const al = x.createLinearGradient(0, 0, 0, H);
  al.addColorStop(0, "#d8dbe1");
  al.addColorStop(1, "#c3c6cd");
  x.fillStyle = al;
  x.fillRect(0, 0, W, H);

  for (let i = 0; i < 2; i++) for (let r = 0; r < 12; r++) for (let c = 0; c < 4; c++) {
    x.beginPath();
    x.arc(14 + c * 9 + i * 976, 150 + r * 14, 1.6, 0, Math.PI * 2);
    x.fillStyle = "rgba(60,62,72,.55)";
    x.fill();
  }

  lpFill(x, 52, 40, 920, 340, 14, "#121216");
  const rows = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.6],
    [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
    [1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.5],
    [1.1, 1.1, 1.1, 1.3, 5.2, 1.3, 1.1, 1.1, 1.1],
  ];
  const legends = ["", "1234567890-=", "QWERTYUIOP[]", "ASDFGHJKL;'", "ZXCVBNM,./", ""];
  const heights = [30, 48, 48, 48, 48, 48];
  let y = 52;
  rows.forEach((row, ri) => {
    const total = row.reduce((a, b) => a + b, 0);
    const unit = (896 - (row.length - 1) * 6) / total;
    let px = 64;
    row.forEach((wgt, ki) => {
      const kw = wgt * unit;
      lpFill(x, px, y, kw, heights[ri], 6, "#24252b");
      lpFill(x, px + 1, y + 1, kw - 2, 4, 3, "rgba(255,255,255,.06)");
      const lg = legends[ri].charAt(ki - (ri === 2 || ri === 3 || ri === 4 ? 1 : 0));
      if (lg && ((ri === 1 && ki < 12) || (ri >= 2 && ri <= 4 && ki >= 1 && ki <= legends[ri].length))) lpText(x, lg, px + kw / 2, y + heights[ri] / 2, 15, "#9a9ca8", 600, "center");
      px += kw + 6;
    });
    y += heights[ri] + 6;
  });

  lpFill(x, 322, 410, 380, 230, 18, "rgba(255,255,255,.16)");
  lpPath(x, 322, 410, 380, 230, 18);
  x.lineWidth = 2;
  x.strokeStyle = "rgba(40,42,52,.28)";
  x.stroke();
}

/** Returns { group, update }. `env` = optional reflection environment (see createStudioEnv). */
export function createLaptop(env: THREE.Texture | null) {
  const group = new THREE.Group();
  const lap = new THREE.Group();
  lap.scale.setScalar(1.35);
  lap.rotation.x = 0.3; // look slightly down onto the keyboard like a product shot
  lap.position.y = -0.2;
  group.add(lap);

  const alu = new THREE.MeshPhysicalMaterial({ color: 0xc9ccd3, metalness: 1, roughness: 0.34, clearcoat: 0.15, clearcoatRoughness: 0.4, envMap: env, envMapIntensity: 1.3 });

  function slab(w: number, h: number, r: number, depth: number, bevel: number) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 10 });
  }

  // base (unibody)
  const baseGeo = slab(3.2, 2.1, 0.13, 0.06, 0.02);
  baseGeo.rotateX(-Math.PI / 2);
  baseGeo.translate(0, -0.03, 0);
  lap.add(new THREE.Mesh(baseGeo, alu));

  // keyboard deck
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(3.14, 2.06), new THREE.MeshStandardMaterial({ map: lpDeckTexture(), roughness: 0.55, metalness: 0.35, envMap: env, envMapIntensity: 0.6 }));
  deck.rotation.x = -Math.PI / 2;
  deck.position.y = 0.054;
  lap.add(deck);

  // hinge
  const hingeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.6, 24), new THREE.MeshStandardMaterial({ color: 0x23242a, metalness: 0.8, roughness: 0.4 }));
  hingeMesh.rotation.z = Math.PI / 2;
  hingeMesh.position.set(0, 0.06, -1.02);
  lap.add(hingeMesh);

  // lid
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.05, -1.0);
  hinge.rotation.x = -0.2;
  lap.add(hinge);
  const shellGeo = slab(3.2, 2.0, 0.11, 0.04, 0.014);
  shellGeo.translate(0, 1.0, -0.068);
  hinge.add(new THREE.Mesh(shellGeo, alu));

  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(3.14, 1.94), new THREE.MeshBasicMaterial({ color: 0x050507 }));
  bezel.position.set(0, 1.0, 0.002);
  hinge.add(bezel);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.875), new THREE.MeshBasicMaterial({ map: lpScreenTexture(), toneMapped: false }));
  screen.position.set(0, 1.0, 0.004);
  hinge.add(screen);

  const glareCanvas = lpCanvas(256, 160);
  const gx = glareCanvas.getContext("2d")!;
  const gg = gx.createLinearGradient(0, 0, 256, 160);
  gg.addColorStop(0, "rgba(255,255,255,0.0)");
  gg.addColorStop(0.42, "rgba(255,255,255,0.0)");
  gg.addColorStop(0.5, "rgba(255,255,255,0.16)");
  gg.addColorStop(0.58, "rgba(255,255,255,0.0)");
  gg.addColorStop(1, "rgba(255,255,255,0.0)");
  gx.fillStyle = gg;
  gx.fillRect(0, 0, 256, 160);
  const glare = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.875), new THREE.MeshBasicMaterial({ map: lpTexture(glareCanvas), transparent: true, depthWrite: false }));
  glare.position.set(0, 1.0, 0.006);
  hinge.add(glare);

  // soft contact shadow under the floating laptop
  const shCanvas = lpCanvas(256, 160);
  const sx = shCanvas.getContext("2d")!;
  const sg = sx.createRadialGradient(128, 80, 4, 128, 80, 120);
  sg.addColorStop(0, "rgba(20,10,50,0.38)");
  sg.addColorStop(1, "rgba(20,10,50,0)");
  sx.fillStyle = sg;
  sx.fillRect(0, 0, 256, 160);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 3.4), new THREE.MeshBasicMaterial({ map: lpTexture(shCanvas), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, -1.35, 0);
  group.add(shadow);

  return {
    group,
    update: (T: number) => {
      lap.position.y = -0.2 + Math.sin(T * 0.9) * 0.06;
      shadow.scale.setScalar(1 - Math.sin(T * 0.9) * 0.04);
    },
  };
}

function lpScreenTexture() {
  const c = lpCanvas(1024, 640);
  paintScreen(c.getContext("2d")!);
  return lpTexture(c);
}
function lpDeckTexture() {
  const c = lpCanvas(1024, 672);
  paintDeck(c.getContext("2d")!);
  return lpTexture(c);
}
