import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createPlusMesh, createStudioEnv, PLUS_UNIT } from "./createPlusMesh";

/**
 * ONE persistent 3D "+" that lands on every <PlusAnchor /> and glides between them while the page scrolls.
 *
 * How an anchor gets the plus: every anchor has a weight = how "present" it is
 *   • inside an element carrying  data-plus-presence="0..1"  (scrubbed / pinned sections publish this) → that value
 *   • otherwise → the product of the opacity of its ancestors
 * multiplied by "is it near the screen centre". The plus sits at the weighted average of all anchors,
 * so while one anchor fades out and the next fades in it travels between them (arc, scale pulse, one full turn).
 * Positions are read live from the DOM, so layout, sticky/pinned sections, transforms and resizes all just work.
 */

const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (x: number) => x * x * (3 - 2 * x);

type Vec3 = [number, number, number];
export interface PoseItem { op: number; cx: number; cy: number; s: number; rot: Vec3; idx: number; fl: number }
export interface Pose { x: number; y: number; s: number; r: Vec3; fly: number }

/** Pure & testable: where should the plus be, given every anchor's presence + live position? */
export function computePose(items: PoseItem[], vh: number, T: number): Pose | null {
  let W = 0, W2 = 0, x = 0, y = 0, s = 0, sp = 0, rx = 0, ry = 0, rz = 0, fl = 0;
  for (const it of items) {
    const edge = clamp(1 - (Math.abs(it.cy - vh / 2) - vh * 0.4) / (vh * 0.5), 0, 1);
    const w = smooth(clamp(it.op, 0, 1)) * edge;
    if (!(w > 0.0005)) continue;
    W += w; W2 += w * w;
    x += w * it.cx; y += w * it.cy; s += w * it.s; sp += w * it.idx * TAU;
    rx += w * it.rot[0]; ry += w * it.rot[1]; rz += w * it.rot[2]; fl += w * it.fl;
  }
  if (W < 0.002) return null;
  const inv = 1 / W;
  const fly = clamp((1 - W2 * inv * inv) * 2, 0, 1);            // 0 = resting on one anchor … 1 = halfway between two
  return {
    x: x * inv,
    y: y * inv - fly * Math.min(110, vh * 0.12) + Math.sin(T * 1.2) * fl * inv * (1 - fly),
    s: s * inv * (1 + 0.35 * fly) * clamp(W, 0, 1),
    r: [rx * inv, ry * inv + sp * inv, rz * inv + fly * 0.5],
    fly,
  };
}

interface Anchor { el: HTMLElement; scale: number; rot: Vec3; float: number; anc: HTMLElement[]; pres: HTMLElement | null }

export class SharedPlusEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 1, 10, 6000);
  private plus = createPlusMesh();                       // ← THE one and only Plus
  private lime = new THREE.PointLight(0xb6f02a, 0.5, 1500, 0);
  private violet = new THREE.PointLight(0xa58bff, 0.5, 1500, 0);

  private anchors: Anchor[] = [];
  private cur: Pose | null = null;
  private tilt = 0;
  private shown = false;
  private lw = 0;
  private lh = 0;
  private vel = 0;
  private time = 0;
  private last = 0;
  private raf = 0;
  private timer = 0;
  private st?: ScrollTrigger;
  private ro?: ResizeObserver;
  private mo?: MutationObserver;
  private reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 800 ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);
    try { this.scene.environment = createStudioEnv(this.renderer); } catch { /* flat lighting fallback */ }

    this.plus.visible = false;
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(200, 300, 400);
    this.scene.add(this.plus, new THREE.AmbientLight(0xffffff, 0.45), key, this.lime, this.violet);
  }

  start() {
    gsap.registerPlugin(ScrollTrigger);
    this.resize();
    this.collect();

    this.st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => { const v = self.getVelocity(); this.vel = Number.isFinite(v) ? v : 0; } });
    ScrollTrigger.addEventListener("refresh", this.collect);
    window.addEventListener("resize", this.onResize);
    window.addEventListener("load", this.onLoad);
    this.ro = new ResizeObserver(this.debouncedCollect);
    this.ro.observe(document.body);
    this.mo = new MutationObserver(this.debouncedCollect);            // anchors added/removed by React
    this.mo.observe(document.body, { childList: true, subtree: true });
    document.fonts?.ready.then(this.collect);

    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.timer);
    this.st?.kill();
    ScrollTrigger.removeEventListener("refresh", this.collect);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("load", this.onLoad);
    this.ro?.disconnect();
    this.mo?.disconnect();
    this.plus.geometry.dispose();
    (this.plus.material as THREE.Material).dispose();
    (this.scene.environment as THREE.Texture | null)?.dispose();
    this.renderer.dispose();
  }

  /* ---------- layout ---------- */
  private resize() {
    const W = window.innerWidth, H = window.innerHeight;
    this.renderer.setSize(W, H, false);
    this.camera.aspect = W / H;
    const dist = H / 2 / Math.tan((15 * Math.PI) / 180);   // perspective camera that maps 1 unit = 1 css px at z=0
    this.camera.position.set(W / 2, -H / 2, dist);
    this.camera.lookAt(W / 2, -H / 2, 0);
    this.camera.updateProjectionMatrix();
  }

  private collect = () => {
    this.anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-plus-anchor]")).map((el): Anchor => {
      const d = el.dataset, anc: HTMLElement[] = [];
      for (let p = el.parentElement, n = 0; p && p !== document.body && n < 8; p = p.parentElement, n++) anc.push(p);
      return {
        el, anc, pres: null,
        scale: Number(d.plusScale) || 1,
        float: d.plusFloat == null ? 6 : Number(d.plusFloat),
        rot: (d.plusRot ?? "0,0,0").split(",").map((v) => ((Number(v) || 0) * Math.PI) / 180) as Vec3,
      };
    });
  };
  private debouncedCollect = () => { clearTimeout(this.timer); this.timer = window.setTimeout(this.collect, 120); };
  private onResize = () => { clearTimeout(this.timer); this.timer = window.setTimeout(() => { this.resize(); this.collect(); }, 80); };
  private onLoad = () => { this.resize(); this.collect(); ScrollTrigger.refresh(); };

  private items(): PoseItem[] {
    return this.anchors.map((a, idx) => {
      const r = a.el.getBoundingClientRect();
      a.pres = a.pres ?? a.el.closest<HTMLElement>("[data-plus-presence]");
      let op = 1;
      if (a.pres) { op = parseFloat(a.pres.dataset.plusPresence ?? "1"); if (Number.isNaN(op)) op = 1; }
      else for (const p of a.anc) { const v = parseFloat(getComputedStyle(p).opacity); if (!Number.isNaN(v)) op *= v; }
      return { op, cx: r.left + r.width / 2, cy: r.top + r.height / 2, s: Math.max(r.height, r.width * 0.8) * a.scale, rot: a.rot, idx, fl: a.float };
    });
  }

  /* ---------- per frame ---------- */
  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.05, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    this.time += dt;
    if (document.hidden) return;
    if (window.innerWidth !== this.lw || window.innerHeight !== this.lh) { // viewport changed (toolbars, scrollbars, iframe resize)
      this.lw = window.innerWidth; this.lh = window.innerHeight; this.resize();
    }

    const o = computePose(this.items(), window.innerHeight, this.reduce ? 0 : this.time);
    if (!o) { this.plus.visible = false; if (this.shown) { this.renderer.clear(); this.shown = false; } return; }
    if (!this.cur) this.cur = { x: o.x, y: o.y, s: 0, r: [...o.r], fly: 0 };

    const c = this.cur, k = this.reduce ? 1 : 1 - Math.exp(-dt * 6);   // damping → never teleports
    c.x += (o.x - c.x) * k; c.y += (o.y - c.y) * k; c.s += (o.s - c.s) * k;
    for (let i = 0; i < 3; i++) c.r[i] += (o.r[i] - c.r[i]) * k;
    if (![c.x, c.y, c.s, ...c.r].every(Number.isFinite)) { this.cur = null; return; }
    const tv = clamp(this.vel / 5000, -0.5, 0.5);                       // a NaN velocity must never poison the plus
    this.tilt += ((Number.isFinite(tv) ? tv : 0) - this.tilt) * k;
    if (!Number.isFinite(this.tilt)) this.tilt = 0;   // leans with scroll speed (ScrollTrigger)

    this.plus.visible = c.s > 1;
    if (!this.plus.visible) { if (this.shown) { this.renderer.clear(); this.shown = false; } return; }

    const sw = this.reduce ? 0 : 1, T = this.time;
    this.plus.position.set(c.x, -c.y, 0);
    this.plus.scale.setScalar(c.s / PLUS_UNIT);
    this.plus.rotation.set(c.r[0] + Math.sin(T * 0.45) * 0.12 * sw, c.r[1] + Math.sin(T * 0.55) * 0.25 * sw, c.r[2] + Math.sin(T * 0.3) * 0.06 * sw + this.tilt);
    this.lime.position.set(c.x - c.s * 2.6, -c.y - c.s * 1.2, c.s * 3);
    this.violet.position.set(c.x + c.s * 2.6, -c.y + c.s * 1.6, c.s * 3);
    this.shown = true;
    this.renderer.render(this.scene, this.camera);
  };
}
