"use client";

import { useEffect } from "react";

type Params = {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  deps?: any[];
};

export const useHorizontalGsapScroll = ({
  sectionRef,
  trackRef,
  deps = [],
}: Params) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;

    let ctx: any;

    (async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");

      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const totalWidth = track.scrollWidth;
      const containerWidth = section.offsetWidth;
      const scrollDistance = totalWidth - containerWidth;
      if (scrollDistance <= 0) return;

      ctx = gsap.context(() => {
        gsap.to(track, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${scrollDistance}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      }, section);
    })();

    return () => ctx?.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
