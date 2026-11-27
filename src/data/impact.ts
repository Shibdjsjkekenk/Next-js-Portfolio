export type TechShape = "sq" | "hex" | "dot" | "txt";

export interface Tech {
  name: string;
  color: string;
  shape: TechShape;
  glyph: string;
  glyphColor?: string;
  /** Optional real logo from /public, e.g. "/tech/react.svg". Falls back to glyph. */
  icon?: string;
}

export const TECH: Tech[] = [
  { name: "HTML", color: "#e44d26", shape: "sq", glyph: "5" },
  { name: "CSS", color: "#1572b6", shape: "sq", glyph: "3" },
  { name: "Bootstrap", color: "#7952b3", shape: "sq", glyph: "B" },
  { name: "Tailwind CSS", color: "#38bdf8", shape: "txt", glyph: "≈" },
  { name: "JavaScript", color: "#f7df1e", shape: "sq", glyph: "JS", glyphColor: "#222" },
  { name: "TypeScript", color: "#3178c6", shape: "sq", glyph: "TS" },
  { name: "React JS", color: "#61dafb", shape: "txt", glyph: "⚛" },
  { name: "Next JS", color: "#000000", shape: "dot", glyph: "N" },
  { name: "Redux", color: "#764abc", shape: "dot", glyph: "R" },
  { name: "GSAP", color: "#0ae448", shape: "txt", glyph: "GSAP" },
  { name: "Node JS", color: "#539e43", shape: "hex", glyph: "JS" },
  { name: "Express JS", color: "#222222", shape: "txt", glyph: "ex" },
  { name: "MongoDB", color: "#47a248", shape: "txt", glyph: "🍃" },
  { name: "Redis", color: "#dc382d", shape: "dot", glyph: "R" },
  { name: "Socket.IO", color: "#111111", shape: "dot", glyph: "⚡" },
  { name: "Geolocation", color: "#e53935", shape: "txt", glyph: "📍" },
  { name: "Gen AI", color: "#10a37f", shape: "hex", glyph: "AI" },
  { name: "AI Agent", color: "#334155", shape: "txt", glyph: "🤖" },
  { name: "RAG", color: "#6f5cf6", shape: "sq", glyph: "DB" },
  { name: "LangChain", color: "#1c8c3c", shape: "hex", glyph: "LC" },
  { name: "AWS", color: "#ff9900", shape: "txt", glyph: "aws" },
  { name: "NGINX", color: "#009639", shape: "hex", glyph: "N" },
  { name: "CI/CD", color: "#4a6cf7", shape: "txt", glyph: "⟳" },
];

export interface Stat {
  value: number;
  decimals: number;
  label: string;
}

export const STATS: Stat[] = [
  { value: 3.2, decimals: 1, label: "Years Experience" },
  { value: 12, decimals: 0, label: "Projects Built" },
  { value: 20, decimals: 0, label: "Technologies" },
  { value: 5, decimals: 0, label: "AI Features Developed" },
];

export const STICKERS = ["full-stack dev 🧑‍💻", "AI-pilled 🤖", "no cap 🧢"];

/** Last chapter: RAG + AI-agent pipeline (shown as numbered cards, in order) */
export const AI_FLOW: Tech[] = [
  { name: "Documents", color: "#6f5cf6", shape: "txt", glyph: "📄" },
  { name: "Embedding", color: "#7b61ff", shape: "sq", glyph: "01" },
  { name: "Vector DB", color: "#4a6cf7", shape: "sq", glyph: "DB" },
  { name: "RAG", color: "#f26b4f", shape: "hex", glyph: "RAG" },
  { name: "LangChain", color: "#1c8c3c", shape: "txt", glyph: "🦜🔗" },
  { name: "Gen AI", color: "#10a37f", shape: "hex", glyph: "AI" },
  { name: "AI Agent", color: "#334155", shape: "txt", glyph: "🤖" },
];

/**
 * Optional: a REAL laptop photo (transparent PNG in /public, e.g. "/laptop.png") to show instead of the generated 3D laptop.
 * Leave undefined to use the procedural, realistic 3D laptop.
 */
export const LAPTOP_PHOTO: string | undefined = undefined;
