"use client";

import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type UseSkillProps = {
  sectionRef: RefObject<HTMLDivElement | null>;
  leftRef: RefObject<HTMLDivElement | null>;
  rightRef: RefObject<HTMLDivElement | null>;
};

export const useSkill = ({
  sectionRef,
  leftRef,
  rightRef,
}: UseSkillProps): void => {
  useEffect(() => {
    if (!sectionRef.current || !leftRef.current || !rightRef.current) return;

    const mm = gsap.matchMedia();

    /* ---------- LEFT PIN ---------- */
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: "top top",
        end: () => `+=${rightRef.current!.scrollHeight}`,
        pin: leftRef.current!,
        scrub: true,
        anticipatePin: 1,
      });
    });

    /* ---------- FAST GLOW / BLING ---------- */
    const cards = gsap.utils.toArray<HTMLDivElement>(".skill-card");
    const tl = gsap.timeline({ repeat: -1 });

    cards.forEach((card) => {
      tl.to(card, {
        borderColor: "rgba(239, 68, 68, 0.6)",
        boxShadow:
          "0 0 0 1px rgba(239,68,68,0.5), 0 0 18px rgba(239,68,68,0.35)",
        duration: 0.25,
        ease: "power3.out",
      }).to(
        card,
        {
          borderColor: "#E5E7EB",
          boxShadow: "none",
          duration: 0.2,
          ease: "power2.in",
        },
        "+=0.15"
      );
    });

    return () => {
      tl.kill();
      mm.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [sectionRef, leftRef, rightRef]);
};
