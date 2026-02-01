"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Professional Step-by-Step Content
const texts = [
  <>
    <>
      {/* Mobile view */}
      <span className="block md:hidden">
        <span className="block">Inspiring</span>
        <span className="block">the</span>
        <span className="block">World</span>
      </span>

      {/* Desktop view */}
      <span className="hidden md:block">Inspiring the World</span>
    </>
    <>
      {/* Mobile view */}
      <span className="block md:hidden text-[#6A38C2]">
        <span className="block">One Project</span>
        <span className="block">at</span>
        <span className="block">a</span>
      </span>

      {/* Desktop view */}
      <span className="hidden md:block text-[#6A38C2]">One Project at a</span>
    </>
    <span className="block">Time</span>
  </>,
  <>
    {/* Mobile view */}
    <span className="block md:hidden">
      <span className="block">A</span>
      <span className="block">Portfolio</span>
      <span className="block">of</span>
      <span
        className="block text-[#E7000B] italic"
        style={{
          fontFamily: "'Segoe Script','Brush Script MT',cursive",
          letterSpacing: "0.05em",
        }}
      >
        Creativity
      </span>
    </span>

    {/* Desktop view */}
    <span className="hidden md:block">
      <span className="block">A Portfolio of</span>
      <span
        className="block text-[#E7000B] italic"
        style={{
          fontFamily: "'Segoe Script','Brush Script MT',cursive",
          letterSpacing: "0.05em",
        }}
      >
        Creativity
      </span>
    </span>
  </>,

  <>
    <span className="block">
      A <span className="inline-block text-[#FEC809]">Portfolio</span> of
      Innovation
    </span>
  </>,
  <>
    {/* Mobile view */}
    <span className="block md:hidden">
      <span className="block">A</span>
      <span className="block">Showcase</span>
      <span className="block">of</span>
      <span className="block">Real-World</span>
      <span className="block text-[#6A38C2] font-bold tracking-wide">
        Projects
      </span>
    </span>

    {/* Desktop view */}
    <span className="hidden md:block">
      <span className="block">
        A Showcase of Real-World{" "}
        <span className="inline-block text-[#6A38C2] font-bold tracking-wide">
          Projects
        </span>
      </span>
    </span>
  </>,
];

const OneProject = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLHeadingElement | null)[]>([]);
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Initial state
      itemsRef.current.forEach((el, i) => {
        gsap.set(el, {
          opacity: i === 0 ? 1 : 0,
          scale: i === 0 ? 1 : 0.7,
          yPercent: i === 0 ? 0 : 15,
          filter: i === 0 ? "blur(0px)" : "blur(12px)",
          zIndex: texts.length - i,
        });
      });

      const scrollLength = texts.length * window.innerHeight * 1.6;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${scrollLength}`,
          scrub: 0.9,
          pin: true,
          pinSpacing: true, // ✅ LET GSAP HANDLE SPACE
          anticipatePin: 1,
        },
      });

      itemsRef.current.forEach((el, i) => {
        const next = itemsRef.current[i + 1];

        // Current text zoom
        tl.to(el, {
          scale: 4.5,
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          duration: 1,
        });

        // Next text enters immediately
        if (next) {
          tl.to(
            next,
            {
              opacity: 1,
              scale: 1,
              yPercent: 0,
              filter: "blur(0px)",
              ease: "none",
              duration: 1,
            },
            "<",
          );
        }

        // Current text exit
        tl.to(
          el,
          {
            scale: 6,
            opacity: 0,
            filter: "blur(0px)",
            ease: "none",
            duration: 1,
          },
          "<+=0.2",
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden z-20"
    >
      <div className="absolute inset-0 flex items-center justify-center perspective-[1200px]">
        {texts.map((text, i) => (
          <h1
            key={i}
            ref={(el) => {
              if (el) itemsRef.current[i] = el;
            }}
            className="
              absolute
              text-center
              text-black
              font-extrabold
              uppercase
              tracking-tight
              text-[14vw] md:text-[8vw]
              leading-tight
              will-change-transform
              pointer-events-none
            "
          >
            {text}
          </h1>
        ))}
      </div>
    </section>
  );
};

export default OneProject;
