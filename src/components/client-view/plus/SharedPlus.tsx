"use client";

import { useEffect, useRef } from "react";
import { SharedPlusEngine } from "@/lib/plus/SharedPlusEngine";

/**
 * Mount ONCE (app/layout.tsx). It owns the single persistent 3D "+" for the whole site.
 * No React state → no re-renders while scrolling.
 */
export default function SharedPlus() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let engine: SharedPlusEngine | null = null;
    try { engine = new SharedPlusEngine(el); engine.start(); } catch { /* WebGL unavailable → site still works */ }
    return () => engine?.destroy();
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 30, pointerEvents: "none" }}
    />
  );
}
