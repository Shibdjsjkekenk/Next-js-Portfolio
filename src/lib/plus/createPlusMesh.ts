import * as THREE from "three";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Rounded-corner polygon → THREE.Shape */
function roundedShape(pts: THREE.Vector2[], radius: number) {
  const shape = new THREE.Shape();
  const n = pts.length;
  pts.forEach((p1, i) => {
    const p0 = pts[(i + n - 1) % n], p2 = pts[(i + 1) % n];
    const a = new THREE.Vector2().subVectors(p0, p1).normalize().multiplyScalar(radius).add(p1);
    const b = new THREE.Vector2().subVectors(p2, p1).normalize().multiplyScalar(radius).add(p1);
    if (i === 0) shape.moveTo(a.x, a.y); else shape.lineTo(a.x, a.y);
    shape.quadraticCurveTo(p1.x, p1.y, b.x, b.y);
  });
  shape.closePath();
  return shape;
}

/** Width of the plus (incl. bevel) in geometry units – used to convert px → scale. */
export const PLUS_UNIT = 1.08;

/**
 * The 3D "+": rounded + bevelled, glossy clear-coat, cyan → lime → warm-yellow gradient baked into vertex colours.
 * Built ONCE by the engine.
 */
export function createPlusMesh(): THREE.Mesh {
  const a = 0.18, L = 0.5;
  const pts = ([[-a, L], [a, L], [a, a], [L, a], [L, -a], [a, -a], [a, -L], [-a, -L], [-a, -a], [-L, -a], [-L, a], [-a, a]] as const)
    .map(([x, y]) => new THREE.Vector2(x, y));
  const geo = new THREE.ExtrudeGeometry(roundedShape(pts, 0.06), {
    depth: 0.22, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 6, curveSegments: 10,
  });
  geo.center();

  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const c0 = new THREE.Color(0x0f9fc2), c1 = new THREE.Color(0x5fae06), c2 = new THREE.Color(0xc78a00), c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const t = clamp(((pos.getX(i) - pos.getY(i)) * 0.7) / (L * 1.4) * 0.5 + 0.5, 0, 1);
    if (t < 0.5) c.copy(c0).lerp(c1, t * 2); else c.copy(c1).lerp(c2, (t - 0.5) * 2);
    col.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));

  return new THREE.Mesh(
    geo,
    new THREE.MeshPhysicalMaterial({
      vertexColors: true, roughness: 0.32, metalness: 0.15, clearcoat: 0.6, clearcoatRoughness: 0.15,
      envMapIntensity: 0.75, emissive: 0x1a2c00, emissiveIntensity: 0.04,
    })
  );
}

/** Small "photo-studio" reflection environment (pink / lavender / lime dome + soft boxes) → realistic gloss. */
export function createStudioEnv(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pm = new THREE.PMREMGenerator(renderer);
  const env = new THREE.Scene();

  const dome = new THREE.SphereGeometry(50, 32, 16);
  const cols = new Float32Array(dome.attributes.position.count * 3);
  const top = new THREE.Color(0xf1ecff), mid = new THREE.Color(0xff9fd2), low = new THREE.Color(0xc9f46a), c = new THREE.Color();
  for (let i = 0; i < dome.attributes.position.count; i++) {
    const y = dome.attributes.position.getY(i) / 50;
    if (y > 0.2) c.copy(mid).lerp(top, clamp((y - 0.2) / 0.8, 0, 1)); else c.copy(low).lerp(mid, clamp((y + 0.6) / 0.8, 0, 1));
    cols.set([c.r, c.g, c.b], i * 3);
  }
  dome.setAttribute("color", new THREE.BufferAttribute(cols, 3));
  env.add(new THREE.Mesh(dome, new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true })));

  const box = new THREE.PlaneGeometry(26, 16);
  const white = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  ([[-30, 22, 30], [36, 8, 22], [0, 42, -26]] as const).forEach(([x, y, z]) => {
    const m = new THREE.Mesh(box, white);
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    env.add(m);
  });

  const tex = pm.fromScene(env, 0.04).texture;
  pm.dispose();
  dome.dispose(); box.dispose(); white.dispose();
  return tex;
}
