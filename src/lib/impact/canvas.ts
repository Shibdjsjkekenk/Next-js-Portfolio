import * as THREE from "three";
import type { Tech } from "@/data/impact";

export const FONT = "'DM Sans', system-ui, sans-serif";

export function roundRect(
  x: CanvasRenderingContext2D, a: number, b: number, w: number, h: number, r: number
) {
  x.beginPath();
  x.moveTo(a + r, b);
  x.arcTo(a + w, b, a + w, b + h, r);
  x.arcTo(a + w, b + h, a, b + h, r);
  x.arcTo(a, b + h, a, b, r);
  x.arcTo(a, b, a + w, b, r);
  x.closePath();
}

export function makeTexture(
  w: number, h: number,
  draw: (x: CanvasRenderingContext2D, w: number, h: number) => void
): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Small rounded label tile ("</>", "AI" ...) */
export function labelTile(text: string, bg: string, fg: string, size: number) {
  const map = makeTexture(128, 128, (x, w, h) => {
    x.fillStyle = bg; roundRect(x, 2, 2, w - 4, h - 4, 26); x.fill();
    x.fillStyle = fg;
    x.font = `bold ${text.length > 2 ? 30 : 44}px ${FONT}`;
    x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText(text, w / 2, h / 2 + 2);
  });
  return new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ map, transparent: true, side: THREE.DoubleSide })
  );
}

function drawGlyph(x: CanvasRenderingContext2D, t: Tech, cx: number, cy: number) {
  x.fillStyle = t.color;
  if (t.shape === "sq") { roundRect(x, cx - 30, cy - 30, 60, 60, 10); x.fill(); }
  if (t.shape === "dot") { x.beginPath(); x.arc(cx, cy, 30, 0, Math.PI * 2); x.fill(); }
  if (t.shape === "hex") {
    x.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI / 3) * k + Math.PI / 6;
      x.lineTo(cx + Math.cos(a) * 34, cy + Math.sin(a) * 34);
    }
    x.closePath(); x.fill();
  }
  x.fillStyle = t.shape === "txt" ? t.color : t.glyphColor ?? "#fff";
  x.font = `bold ${t.glyph.length > 2 ? 26 : 34}px ${FONT}`;
  x.textAlign = "center"; x.textBaseline = "middle";
  x.fillText(t.glyph, cx, cy + 2);
}

/** White card + round icon + label, like the tech grid on the site. */
export function techTile(t: Tech) {
  const c = document.createElement("canvas");
  c.width = 200; c.height = 230;
  const x = c.getContext("2d")!;

  const paint = (img?: HTMLImageElement) => {
    x.clearRect(0, 0, 200, 230);
    x.fillStyle = "#fff"; roundRect(x, 3, 3, 194, 224, 22); x.fill();
    x.strokeStyle = "#e4e1f2"; x.lineWidth = 3; x.stroke();
    x.beginPath(); x.arc(100, 90, 52, 0, Math.PI * 2); x.stroke();
    if (img) x.drawImage(img, 70, 60, 60, 60);
    else drawGlyph(x, t, 100, 90);
    x.fillStyle = "#222"; x.font = `600 24px ${FONT}`;
    x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText(t.name, 100, 190);
  };
  paint();

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;

  if (t.icon) {
    const img = new Image();
    img.onload = () => { paint(img); map.needsUpdate = true; };
    img.src = t.icon;
  }
  return new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1.15),
    new THREE.MeshBasicMaterial({ map, transparent: true, side: THREE.DoubleSide })
  );
}

/** Wide caption pill (e.g. "retrieve → augment → generate") */
export function pill(text: string, bg: string, fg: string, width: number) {
  const map = makeTexture(Math.round(width * 200), 68, (x, w, h) => {
    x.fillStyle = bg; roundRect(x, 2, 2, w - 4, h - 4, 32); x.fill();
    x.fillStyle = fg; x.font = `600 28px ${FONT}`;
    x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText(text, w / 2, h / 2 + 1);
  });
  return new THREE.Mesh(
    new THREE.PlaneGeometry(width, 0.34),
    new THREE.MeshBasicMaterial({ map, transparent: true, side: THREE.DoubleSide })
  );
}
