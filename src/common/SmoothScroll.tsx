"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // ❌ Admin panel ke liye smooth scroll band
    if (pathname.startsWith("/admin")) return;

    const lenis = new Lenis({
      //  cinematic smoothness
      duration: 1.8,
      lerp: 0.045,

      //  wheel behaviour
      smoothWheel: true,
      wheelMultiplier: 0.85,

      //  mobile tuning
      touchMultiplier: 1.3,

      //  premium animation easing
      easing: (t) =>
        t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2, // easeInOutCubic
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
