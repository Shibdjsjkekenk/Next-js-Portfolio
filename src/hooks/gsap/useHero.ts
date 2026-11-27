"use client";

import { useEffect } from "react";
import gsap from "gsap";

export const useHero = (
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const icons =
      containerRef.current.querySelectorAll(".social-icon");

    if (!icons.length) return;

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1,
    });

    tl.fromTo(
      icons,
      { y: 0 },
      {
        y: -12,
        duration: 0.45,
        stagger: 0.2,
        ease: "bounce.out",
      }
    ).to(
      icons,
      {
        y: 0,
        duration: 0.35,
        stagger: 0.2,
        ease: "power1.out",
      },
      "+=0.15"
    );

    return () => {
      tl.kill();
    };
  }, [containerRef]);

  
};
