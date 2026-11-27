/**
 * Realistic website / dashboard banners drawn on canvas (640×420) – used as textures on the "Projects Built" carousel.
 * Each painter draws a complete mini product UI: browser chrome, navigation, hero or dashboard, cards, charts, data.
 * Add a new business type = write one painter + one line in BANNERS.
 */
const BF = "'DM Sans', system-ui, sans-serif";
const BW = 640;
const BH = 420;

/* ---------------- tiny drawing helpers ---------------- */
function bnPath(x: CanvasRenderingContext2D, a: number, b: number, w: number, h: number, r: number) {
  x.beginPath();
  x.moveTo(a + r, b);
  x.arcTo(a + w, b, a + w, b + h, r);
  x.arcTo(a + w, b + h, a, b + h, r);
  x.arcTo(a, b + h, a, b, r);
  x.arcTo(a, b, a + w, b, r);
  x.closePath();
}
function bnBox(x: CanvasRenderingContext2D, a: number, b: number, w: number, h: number, r: number, fill: string) {
  bnPath(x, a, b, w, h, r);
  x.fillStyle = fill;
  x.fill();
}
function bnDot(x: CanvasRenderingContext2D, cx: number, cy: number, r: number, fill: string) {
  x.beginPath();
  x.arc(cx, cy, r, 0, Math.PI * 2);
  x.fillStyle = fill;
  x.fill();
}
function bnText(x: CanvasRenderingContext2D, s: string, px: number, py: number, size: number, color: string, weight: number = 600, align: CanvasTextAlign = "left") {
  x.font = `${weight} ${size}px ${BF}`;
  x.fillStyle = color;
  x.textAlign = align;
  x.textBaseline = "middle";
  x.fillText(s, px, py);
}
function bnArc(x: CanvasRenderingContext2D, cx: number, cy: number, r: number, a0: number, a1: number, width: number, color: string) {
  x.beginPath();
  x.arc(cx, cy, r, a0, a1);
  x.lineWidth = width;
  x.strokeStyle = color;
  x.stroke();
}
function bnChrome(x: CanvasRenderingContext2D, url: string) {
  x.fillStyle = "#f6f7fb";
  x.fillRect(0, 0, BW, BH);
  x.fillStyle = "#eceaf7";
  x.fillRect(0, 0, BW, 40);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => bnDot(x, 22 + i * 18, 20, 5, c));
  bnBox(x, 96, 9, 360, 22, 11, "#ffffff");
  bnText(x, url, 112, 20, 12, "#6b6b86", 500);
}
function bnLine(x: CanvasRenderingContext2D, pts: number[], x0: number, y0: number, w: number, h: number, color: string) {
  const step = w / (pts.length - 1);
  const g = x.createLinearGradient(0, y0, 0, y0 + h);
  g.addColorStop(0, color + "55");
  g.addColorStop(1, color + "00");
  x.beginPath();
  pts.forEach((p, i) => (i ? x.lineTo(x0 + i * step, y0 + h - p * h) : x.moveTo(x0, y0 + h - p * h)));
  x.lineTo(x0 + w, y0 + h);
  x.lineTo(x0, y0 + h);
  x.closePath();
  x.fillStyle = g;
  x.fill();
  x.beginPath();
  pts.forEach((p, i) => (i ? x.lineTo(x0 + i * step, y0 + h - p * h) : x.moveTo(x0, y0 + h - p * h)));
  x.lineWidth = 3;
  x.lineJoin = "round";
  x.strokeStyle = color;
  x.stroke();
}

/* ---------------- 1 · E-commerce ---------------- */
function paintShop(x: CanvasRenderingContext2D) {
  bnChrome(x, "shoply.store");
  bnBox(x, 0, 40, BW, BH - 40, 0, "#ffffff");
  bnText(x, "SHOPLY", 28, 64, 20, "#111111", 800);
  ["New", "Men", "Women", "Kids", "Sale"].forEach((s, i) => bnText(x, s, 200 + i * 62, 64, 13, i === 4 ? "#e11d48" : "#555566", 600));
  bnDot(x, 566, 64, 13, "#111111");
  bnText(x, "3", 566, 64, 12, "#ffffff", 700, "center");
  const g = x.createLinearGradient(20, 0, BW - 20, 0);
  g.addColorStop(0, "#ff6a3d");
  g.addColorStop(1, "#ffb347");
  bnPath(x, 20, 88, BW - 40, 150, 18);
  x.fillStyle = g;
  x.fill();
  bnText(x, "SUMMER SALE", 44, 120, 13, "#ffffff", 700);
  bnText(x, "Up to 60% OFF", 44, 156, 32, "#ffffff", 800);
  bnText(x, "Free shipping on orders over $50", 44, 190, 13, "#ffffff", 500);
  bnBox(x, 44, 204, 108, 26, 13, "#111111");
  bnText(x, "Shop now →", 98, 217, 12, "#ffffff", 700, "center");
  bnDot(x, 500, 163, 76, "rgba(255,255,255,.25)");
  bnArc(x, 500, 140, 24, Math.PI, 0, 7, "#111111");
  bnBox(x, 452, 140, 96, 84, 12, "#111111");
  bnBox(x, 470, 168, 60, 10, 5, "#ff6a3d");
  bnText(x, "NEW", 500, 196, 14, "#ffffff", 800, "center");
  const items = [["Runner Pro", "$89", "#ffd8cc", "#ff6a3d"], ["Smart Watch", "$129", "#d8e6ff", "#3b82f6"], ["Backpack", "$64", "#dff5df", "#22a55b"], ["Sunglasses", "$39", "#ece0ff", "#8b5cf6"]];
  items.forEach((it, i) => {
    const px = 20 + i * 152;
    bnBox(x, px, 254, 140, 152, 14, "#f6f7fb");
    bnBox(x, px + 10, 264, 120, 72, 10, it[2]);
    bnDot(x, px + 70, 300, 22, it[3]);
    bnBox(x, px + 100, 270, 26, 14, 7, "#111111");
    bnText(x, "-20%", px + 113, 277, 9, "#ffffff", 700, "center");
    bnText(x, it[0], px + 12, 350, 13, "#111111", 700);
    bnText(x, it[1], px + 12, 371, 15, "#111111", 800);
    bnText(x, "★★★★★", px + 12, 392, 11, "#f5a524", 600);
  });
}

/* ---------------- 2 · Real estate ---------------- */
function paintEstate(x: CanvasRenderingContext2D) {
  bnChrome(x, "homenest.com");
  const sky = x.createLinearGradient(0, 40, 0, 250);
  sky.addColorStop(0, "#b9dcff");
  sky.addColorStop(1, "#f3f8ff");
  x.fillStyle = sky;
  x.fillRect(0, 40, BW, 210);
  [[352, 58, 110], [408, 48, 160], [452, 66, 96], [516, 54, 138], [574, 52, 118]].forEach((b, i) => {
    bnBox(x, b[0], 250 - b[2], b[1], b[2], 5, i % 2 ? "#3b6cf6" : "#5b8cff");
    const rows = Math.floor((b[2] - 16) / 20);
    for (let r = 0; r < rows; r++) for (let c = 0; c < 3; c++) bnBox(x, b[0] + 8 + c * 15, 250 - b[2] + 10 + r * 20, 8, 10, 2, "rgba(255,255,255,.75)");
  });
  bnText(x, "Find your", 32, 92, 30, "#0f1b3d", 800);
  bnText(x, "dream home", 32, 126, 30, "#0f1b3d", 800);
  bnText(x, "12,400+ verified listings across 40 cities", 32, 158, 12, "#4a5578", 500);
  bnBox(x, 24, 180, 420, 46, 23, "#ffffff");
  ["Location", "Type", "Budget"].forEach((s, i) => {
    bnText(x, s, 46 + i * 112, 203, 12, "#6b6b86", 600);
    if (i < 2) bnBox(x, 142 + i * 112, 192, 1, 22, 0, "#e4e1f2");
  });
  bnBox(x, 360, 186, 76, 34, 17, "#16a34a");
  bnText(x, "Search", 398, 203, 12, "#ffffff", 700, "center");
  const homes = [["$450,000", "New", "#ffd9a8", "Beverly Hills"], ["$1.2M", "Luxury", "#c9d7ff", "Palm Beach"], ["$320,000", "Hot", "#bff0d4", "Austin, TX"]];
  homes.forEach((hm, i) => {
    const px = 20 + i * 205;
    bnBox(x, px, 262, 190, 148, 14, "#ffffff");
    bnBox(x, px + 8, 270, 174, 66, 10, hm[2]);
    x.fillStyle = "#ffffff";
    x.beginPath();
    x.moveTo(px + 62, 316);
    x.lineTo(px + 95, 288);
    x.lineTo(px + 128, 316);
    x.closePath();
    x.fill();
    bnBox(x, px + 70, 316, 50, 18, 2, "#ffffff");
    bnBox(x, px + 88, 322, 14, 12, 2, "#9aa7c7");
    bnBox(x, px + 14, 276, 50, 16, 8, "#16a34a");
    bnText(x, hm[1], px + 39, 284, 9, "#ffffff", 700, "center");
    bnText(x, hm[0], px + 12, 352, 16, "#0f1b3d", 800);
    bnText(x, "3 bd · 2 ba · 1,800 sqft", px + 12, 374, 11, "#6b7280", 500);
    bnText(x, hm[3], px + 12, 394, 11, "#6b7280", 500);
  });
}

/* ---------------- 3 · HRMS ---------------- */
function paintHrms(x: CanvasRenderingContext2D) {
  bnChrome(x, "people.hrms.app");
  bnBox(x, 0, 40, 124, BH - 40, 0, "#161a3a");
  bnText(x, "PeopleOS", 18, 64, 16, "#ffffff", 800);
  ["Dashboard", "Employees", "Attendance", "Payroll", "Leaves", "Recruitment"].forEach((s, i) => {
    if (i === 0) bnBox(x, 10, 84, 104, 28, 8, "#4f46e5");
    bnDot(x, 24, 98 + i * 34, 4, i === 0 ? "#ffffff" : "#6b72a8");
    bnText(x, s, 38, 98 + i * 34, 12, i === 0 ? "#ffffff" : "#aab0dc", 600);
  });
  bnText(x, "Dashboard", 144, 62, 18, "#111827", 800);
  bnText(x, "Mon, 24 Nov 2026", 540, 62, 11, "#6b7280", 500, "center");
  [["Employees", "248", "#4f46e5"], ["Present", "231", "#16a34a"], ["On leave", "17", "#f59e0b"], ["Open roles", "6", "#e11d48"]].forEach((k, i) => {
    const px = 138 + i * 124;
    bnBox(x, px, 82, 116, 58, 12, "#ffffff");
    bnBox(x, px + 10, 92, 4, 38, 2, k[2]);
    bnText(x, k[0], px + 22, 100, 10, "#6b7280", 600);
    bnText(x, k[1], px + 22, 124, 22, "#111827", 800);
  });
  bnBox(x, 138, 150, 290, 130, 12, "#ffffff");
  bnText(x, "Weekly attendance", 152, 166, 12, "#111827", 700);
  [0.62, 0.8, 0.7, 0.92, 0.85, 0.4, 0.3].forEach((v, i) => {
    bnBox(x, 156 + i * 38, 270 - v * 84, 22, v * 84, 6, i === 3 ? "#4f46e5" : "#c7c9f5");
    bnText(x, "MTWTFSS".charAt(i), 167 + i * 38, 274, 9, "#9ca3af", 600, "center");
  });
  bnBox(x, 438, 150, 190, 130, 12, "#ffffff");
  bnText(x, "Departments", 452, 166, 12, "#111827", 700);
  bnArc(x, 506, 224, 32, 0, Math.PI * 1.1, 14, "#4f46e5");
  bnArc(x, 506, 224, 32, Math.PI * 1.1, Math.PI * 1.7, 14, "#06b6d4");
  bnArc(x, 506, 224, 32, Math.PI * 1.7, Math.PI * 2, 14, "#f59e0b");
  [["Tech", "#4f46e5"], ["Sales", "#06b6d4"], ["Ops", "#f59e0b"]].forEach((d, i) => {
    bnDot(x, 556, 200 + i * 20, 4, d[1]);
    bnText(x, d[0], 566, 200 + i * 20, 10, "#4b5563", 600);
  });
  bnBox(x, 138, 290, 490, 120, 12, "#ffffff");
  [["Aarav Mehta", "Engineering", "Present", "#16a34a"], ["Priya Nair", "Design", "On leave", "#f59e0b"], ["Rohan Shah", "Sales", "Present", "#16a34a"]].forEach((e, i) => {
    const py = 314 + i * 32;
    bnDot(x, 164, py, 11, ["#a5b4fc", "#fcd34d", "#6ee7b7"][i]);
    bnText(x, e[0], 184, py - 5, 12, "#111827", 700);
    bnText(x, e[1], 184, py + 9, 10, "#6b7280", 500);
    bnBox(x, 540, py - 10, 70, 20, 10, e[3] + "22");
    bnText(x, e[2], 575, py, 10, e[3], 700, "center");
  });
}

/* ---------------- 4 · CRM ---------------- */
function paintCrm(x: CanvasRenderingContext2D) {
  bnChrome(x, "pipeline.crm.io");
  bnBox(x, 0, 40, BW, 56, 0, "#ffffff");
  bnText(x, "Sales pipeline", 24, 68, 18, "#111827", 800);
  [["Revenue", "$128K"], ["Open deals", "42"], ["Win rate", "38%"]].forEach((k, i) => {
    bnBox(x, 340 + i * 98, 52, 90, 34, 10, "#f3f4ff");
    bnText(x, k[0], 350 + i * 98, 62, 9, "#6b7280", 600);
    bnText(x, k[1], 350 + i * 98, 77, 13, "#111827", 800);
  });
  const cols = [
    ["New lead", "#6366f1", [["Acme Corp", "$12K"], ["Globex", "$8K"], ["Initech", "$5K"]]],
    ["Contacted", "#06b6d4", [["Umbrella Co", "$21K"], ["Stark Ind.", "$34K"]]],
    ["Proposal", "#f59e0b", [["Wayne Ent.", "$48K"], ["Hooli", "$16K"], ["Pied Piper", "$9K"]]],
    ["Won", "#22c55e", [["Wonka Ltd", "$62K"], ["Soylent", "$27K"]]],
  ];
  cols.forEach((c, i) => {
    const px = 16 + i * 155;
    bnBox(x, px, 108, 148, 300, 12, "#eef0fb");
    bnDot(x, px + 14, 124, 5, c[1] as string);
    bnText(x, c[0] as string, px + 26, 124, 12, "#111827", 700);
    (c[2] as string[][]).forEach((d, k) => {
      const py = 142 + k * 86;
      bnBox(x, px + 8, py, 132, 76, 10, "#ffffff");
      bnBox(x, px + 18, py + 10, 36, 6, 3, c[1] as string);
      bnText(x, d[0], px + 18, py + 30, 12, "#111827", 700);
      bnText(x, d[1], px + 18, py + 50, 15, "#111827", 800);
      bnDot(x, px + 118, py + 56, 9, ["#fca5a5", "#a5b4fc", "#6ee7b7"][k % 3]);
    });
  });
}

/* ---------------- 5 · ERP ---------------- */
function paintErp(x: CanvasRenderingContext2D) {
  bnChrome(x, "erp.workspace.io");
  bnBox(x, 0, 40, BW, 44, 0, "#0f172a");
  bnText(x, "ERP Workspace", 22, 62, 15, "#ffffff", 800);
  ["Overview", "Inventory", "Finance", "Reports"].forEach((s, i) => bnText(x, s, 330 + i * 76, 62, 11, i === 0 ? "#b6f02a" : "#94a3b8", 600));
  const mods = [["Inventory", "#6366f1"], ["Sales", "#22c55e"], ["Purchase", "#f59e0b"], ["Finance", "#06b6d4"], ["HR", "#ec4899"], ["Reports", "#8b5cf6"]];
  mods.forEach((m, i) => {
    const px = 18 + (i % 3) * 104, py = 98 + Math.floor(i / 3) * 84;
    bnBox(x, px, py, 98, 76, 12, "#ffffff");
    bnBox(x, px + 12, py + 12, 28, 28, 8, m[1]);
    bnBox(x, px + 19, py + 21, 14, 4, 2, "#ffffff");
    bnBox(x, px + 19, py + 28, 10, 4, 2, "#ffffff");
    bnText(x, m[0], px + 12, py + 56, 12, "#111827", 700);
  });
  bnBox(x, 18, 270, 306, 140, 12, "#ffffff");
  bnText(x, "Low stock alerts", 32, 288, 12, "#111827", 700);
  [["SKU-1042  Steel rod", "12 left", "#e11d48"], ["SKU-2210  Bearings", "28 left", "#f59e0b"], ["SKU-0877  Packaging", "64 left", "#22c55e"]].forEach((r, i) => {
    bnText(x, r[0], 32, 314 + i * 30, 11, "#374151", 600);
    bnBox(x, 244, 304 + i * 30, 66, 20, 10, r[2] + "22");
    bnText(x, r[1], 277, 314 + i * 30, 10, r[2], 700, "center");
  });
  bnBox(x, 336, 98, 288, 70, 12, "#ffffff");
  bnText(x, "Revenue", 350, 116, 11, "#6b7280", 600);
  bnText(x, "$482,300", 350, 142, 24, "#111827", 800);
  bnBox(x, 500, 124, 110, 22, 11, "#dcfce7");
  bnText(x, "▲ 12.4% MoM", 555, 135, 10, "#16a34a", 700, "center");
  bnBox(x, 336, 178, 288, 232, 12, "#ffffff");
  bnText(x, "Sales vs Purchase", 350, 196, 12, "#111827", 700);
  bnLine(x, [0.2, 0.35, 0.3, 0.5, 0.45, 0.7, 0.62, 0.85], 352, 214, 256, 150, "#6366f1");
  bnLine(x, [0.1, 0.18, 0.25, 0.22, 0.3, 0.38, 0.35, 0.5], 352, 214, 256, 150, "#22c55e");
  ["Jan", "Mar", "May", "Jul"].forEach((m, i) => bnText(x, m, 360 + i * 80, 388, 10, "#9ca3af", 600));
}

/* ---------------- 6 · Healthcare ---------------- */
function paintHealth(x: CanvasRenderingContext2D) {
  bnChrome(x, "medicare.health");
  bnBox(x, 0, 40, BW, BH - 40, 0, "#f0fdfa");
  bnText(x, "MediCare+", 28, 64, 18, "#0f766e", 800);
  ["Doctors", "Departments", "Records", "Pharmacy"].forEach((s, i) => bnText(x, s, 300 + i * 80, 64, 12, "#0f766e", 600));
  bnText(x, "Book your doctor", 28, 112, 28, "#134e4a", 800);
  bnText(x, "appointment online", 28, 144, 28, "#134e4a", 800);
  bnBox(x, 28, 166, 300, 42, 21, "#ffffff");
  bnText(x, "Search doctor, clinic or symptom", 48, 187, 12, "#6b7280", 500);
  bnBox(x, 256, 172, 66, 30, 15, "#0d9488");
  bnText(x, "Find", 289, 187, 12, "#ffffff", 700, "center");
  bnBox(x, 380, 84, 240, 150, 16, "#ffffff");
  bnText(x, "November 2026", 396, 104, 12, "#134e4a", 800);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
    const sel = r === 2 && c === 3;
    if (sel) bnDot(x, 400 + c * 30, 132 + r * 24, 11, "#0d9488");
    bnText(x, String(r * 7 + c + 1), 400 + c * 30, 132 + r * 24, 11, sel ? "#ffffff" : "#4b5563", sel ? 800 : 500, "center");
  }
  [["Dr. Sarah Lee", "Cardiologist", "#99f6e4"], ["Dr. Amit Rao", "Neurologist", "#fde68a"], ["Dr. Emma Cruz", "Pediatrician", "#fbcfe8"]].forEach((d, i) => {
    const px = 20 + i * 204;
    bnBox(x, px, 258, 194, 144, 14, "#ffffff");
    bnDot(x, px + 40, 300, 24, d[2]);
    bnDot(x, px + 40, 294, 8, "#ffffff");
    bnBox(x, px + 28, 304, 24, 14, 7, "#ffffff");
    bnText(x, d[0], px + 76, 292, 13, "#134e4a", 800);
    bnText(x, d[1], px + 76, 310, 11, "#6b7280", 500);
    bnText(x, "★ 4.9  ·  12 yrs", px + 14, 340, 11, "#f59e0b", 700);
    bnBox(x, px + 14, 358, 166, 30, 15, "#0d9488");
    bnText(x, "Book appointment", px + 97, 373, 12, "#ffffff", 700, "center");
  });
}

/* ---------------- 7 · Food delivery ---------------- */
function paintFood(x: CanvasRenderingContext2D) {
  bnChrome(x, "foodrush.app");
  const g = x.createLinearGradient(0, 40, BW, 250);
  g.addColorStop(0, "#fff3e0");
  g.addColorStop(1, "#ffd9a0");
  x.fillStyle = g;
  x.fillRect(0, 40, BW, 214);
  bnText(x, "FoodRush", 28, 64, 18, "#e65100", 800);
  bnText(x, "Hungry?", 28, 114, 34, "#3e2723", 800);
  bnText(x, "Delivered in 30 min.", 28, 150, 22, "#e65100", 800);
  bnBox(x, 28, 176, 290, 44, 22, "#ffffff");
  bnText(x, "Enter your delivery address", 48, 198, 12, "#8d6e63", 500);
  bnBox(x, 246, 182, 66, 32, 16, "#e65100");
  bnText(x, "Order", 279, 198, 12, "#ffffff", 700, "center");
  bnDot(x, 500, 150, 84, "#ffffff");
  bnDot(x, 500, 150, 70, "#ffcc80");
  bnDot(x, 500, 150, 62, "#ff9800");
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    x.beginPath();
    x.moveTo(500, 150);
    x.lineTo(500 + Math.cos(a) * 62, 150 + Math.sin(a) * 62);
    x.lineWidth = 2;
    x.strokeStyle = "#ffe0b2";
    x.stroke();
  }
  [[480, 130], [520, 140], [495, 168], [530, 172], [470, 160]].forEach((p) => bnDot(x, p[0], p[1], 8, "#d84315"));
  [[512, 120], [488, 148], [515, 160]].forEach((p) => bnDot(x, p[0], p[1], 5, "#2e7d32"));
  ["Pizza", "Burger", "Sushi", "Dessert", "Healthy"].forEach((s, i) => {
    bnBox(x, 20 + i * 96, 232, 88, 28, 14, i === 0 ? "#e65100" : "#ffffff");
    bnText(x, s, 64 + i * 96, 246, 11, i === 0 ? "#ffffff" : "#5d4037", 700, "center");
  });
  [["Pizza Palace", "★ 4.8", "25 min", "#ffccbc"], ["Burger Barn", "★ 4.6", "30 min", "#ffe082"], ["Sushi Zen", "★ 4.9", "35 min", "#c5e1a5"]].forEach((r, i) => {
    const px = 20 + i * 205;
    bnBox(x, px, 272, 190, 138, 14, "#ffffff");
    bnBox(x, px + 8, 280, 174, 66, 10, r[3]);
    bnDot(x, px + 95, 313, 24, "rgba(255,255,255,.7)");
    bnText(x, r[0], px + 12, 364, 13, "#3e2723", 800);
    bnText(x, r[1] + "  ·  " + r[2] + "  ·  Free delivery", px + 12, 386, 10, "#8d6e63", 600);
  });
}

/* ---------------- 8 · Logistics / fleet tracking ---------------- */
function paintLogistics(x: CanvasRenderingContext2D) {
  bnChrome(x, "fleet.track.io");
  x.fillStyle = "#0f172a";
  x.fillRect(0, 40, BW, BH - 40);
  x.strokeStyle = "#1e293b";
  x.lineWidth = 1;
  for (let i = 0; i < 16; i++) {
    x.beginPath(); x.moveTo(i * 44, 40); x.lineTo(i * 44, BH); x.stroke();
  }
  for (let j = 0; j < 9; j++) {
    x.beginPath(); x.moveTo(0, 40 + j * 44); x.lineTo(BW, 40 + j * 44); x.stroke();
  }
  x.strokeStyle = "#334155";
  x.lineWidth = 10;
  x.lineJoin = "round";
  x.beginPath(); x.moveTo(190, 400); x.lineTo(260, 300); x.lineTo(380, 280); x.lineTo(470, 190); x.lineTo(600, 150); x.stroke();
  x.beginPath(); x.moveTo(200, 120); x.lineTo(320, 200); x.lineTo(380, 280); x.stroke();
  x.strokeStyle = "rgba(34,211,238,.25)";
  x.lineWidth = 12;
  x.beginPath(); x.moveTo(230, 360); x.lineTo(280, 300); x.lineTo(380, 280); x.lineTo(470, 190); x.lineTo(560, 160); x.stroke();
  x.strokeStyle = "#22d3ee";
  x.lineWidth = 4;
  x.beginPath(); x.moveTo(230, 360); x.lineTo(280, 300); x.lineTo(380, 280); x.lineTo(470, 190); x.lineTo(560, 160); x.stroke();
  bnDot(x, 230, 360, 9, "#22c55e"); bnDot(x, 230, 360, 4, "#ffffff");
  bnDot(x, 560, 160, 9, "#f43f5e"); bnDot(x, 560, 160, 4, "#ffffff");
  bnBox(x, 395, 250, 44, 28, 8, "#facc15");
  bnBox(x, 410, 256, 22, 16, 4, "#0f172a");
  bnDot(x, 405, 281, 4, "#0f172a"); bnDot(x, 428, 281, 4, "#0f172a");
  [[300, 130], [520, 330], [110, 250]].forEach((p) => { bnDot(x, p[0], p[1], 6, "#f59e0b"); bnDot(x, p[0], p[1], 2.5, "#0f172a"); });
  bnBox(x, 16, 56, 196, 150, 14, "rgba(255,255,255,.96)");
  bnText(x, "Shipment #LG-4821", 30, 76, 12, "#0f172a", 800);
  bnText(x, "Mumbai → Delhi", 30, 96, 11, "#64748b", 600);
  bnText(x, "2h 15m", 30, 128, 26, "#0f172a", 800);
  bnText(x, "ETA · on time", 30, 150, 10, "#16a34a", 700);
  bnBox(x, 30, 168, 168, 8, 4, "#e2e8f0");
  bnBox(x, 30, 168, 112, 8, 4, "#22d3ee");
  bnText(x, "68% delivered", 30, 190, 10, "#64748b", 600);
  [["Active", "38"], ["On time", "94%"], ["Delayed", "2"]].forEach((s, i) => {
    bnBox(x, 16 + i * 106, 346, 98, 56, 12, "rgba(255,255,255,.96)");
    bnText(x, s[0], 28 + i * 106, 362, 10, "#64748b", 600);
    bnText(x, s[1], 28 + i * 106, 384, 18, "#0f172a", 800);
  });
}

/* ---------------- 9 · EdTech / LMS ---------------- */
function paintEdu(x: CanvasRenderingContext2D) {
  bnChrome(x, "learnly.edu");
  bnBox(x, 0, 40, BW, BH - 40, 0, "#f5f3ff");
  bnText(x, "Learnly", 28, 64, 18, "#4c1d95", 800);
  ["Courses", "Mentors", "Live", "Community"].forEach((s, i) => bnText(x, s, 270 + i * 82, 64, 12, "#6d28d9", 600));
  bnBox(x, 566, 52, 56, 24, 12, "#7c3aed");
  bnText(x, "Join", 594, 64, 11, "#ffffff", 700, "center");
  const g = x.createLinearGradient(20, 0, BW - 20, 0);
  g.addColorStop(0, "#6d28d9");
  g.addColorStop(1, "#a78bfa");
  bnPath(x, 20, 86, BW - 40, 142, 18);
  x.fillStyle = g;
  x.fill();
  bnText(x, "Learn without limits", 44, 122, 26, "#ffffff", 800);
  bnText(x, "1,200+ courses · live mentors · certificates", 44, 152, 12, "#ede9fe", 500);
  bnBox(x, 44, 172, 110, 32, 16, "#ffffff");
  bnText(x, "Start free", 99, 188, 12, "#6d28d9", 700, "center");
  bnDot(x, 520, 157, 58, "rgba(255,255,255,.18)");
  bnArc(x, 520, 157, 44, -Math.PI / 2, Math.PI * 1.1, 10, "#fde047");
  bnArc(x, 520, 157, 44, Math.PI * 1.1, Math.PI * 1.5, 10, "rgba(255,255,255,.35)");
  bnText(x, "72%", 520, 152, 20, "#ffffff", 800, "center");
  bnText(x, "completed", 520, 174, 10, "#ede9fe", 600, "center");
  [["React Masterclass", "#fde68a", "42 lessons", "#f59e0b"], ["UI/UX Design", "#fbcfe8", "36 lessons", "#ec4899"], ["Data Science", "#bfdbfe", "58 lessons", "#3b82f6"]].forEach((c, i) => {
    const px = 20 + i * 205;
    bnBox(x, px, 244, 190, 166, 14, "#ffffff");
    bnBox(x, px + 8, 252, 174, 78, 10, c[1]);
    bnDot(x, px + 95, 291, 20, "#ffffff");
    x.fillStyle = c[3];
    x.beginPath();
    x.moveTo(px + 89, 281);
    x.lineTo(px + 89, 301);
    x.lineTo(px + 105, 291);
    x.closePath();
    x.fill();
    bnText(x, c[0], px + 12, 348, 13, "#2e1065", 800);
    bnText(x, c[2] + " · 4.8 ★", px + 12, 368, 10, "#6b7280", 600);
    bnBox(x, px + 12, 384, 166, 7, 3.5, "#ede9fe");
    bnBox(x, px + 12, 384, [110, 70, 40][i], 7, 3.5, c[3]);
  });
}

export const BANNERS = [
  { name: "E-commerce", label: "E-COMMERCE STORE", paint: paintShop },
  { name: "Real Estate", label: "REAL ESTATE PORTAL", paint: paintEstate },
  { name: "HRMS", label: "HRMS · HR & PAYROLL", paint: paintHrms },
  { name: "CRM", label: "CRM · SALES PIPELINE", paint: paintCrm },
  { name: "ERP", label: "ERP · OPERATIONS", paint: paintErp },
  { name: "Healthcare", label: "HOSPITAL & BOOKING", paint: paintHealth },
  { name: "Food Delivery", label: "FOOD DELIVERY APP", paint: paintFood },
  { name: "Logistics", label: "FLEET & LOGISTICS", paint: paintLogistics },
  { name: "EdTech", label: "EDTECH · LMS", paint: paintEdu },
];
