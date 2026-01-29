"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/* framer-motion dynamic import (SSR SAFE) */
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const categories: string[] = [
  "Next JS Developer",
  "Frontend Developer",
  "React JS Developer",
  "Software Developer",
  "UI Developer",
  "Full Stack Developer",
  "Web Developer",
];

const CategoryCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 220;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-7xl py-15 mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 text-center">
      <MotionDiv
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">
          Expert in Tech <span className="text-[#6A38C2]">Domain....</span>
        </h1>

        <p className="mt-2 text-gray-700">
          Expert in the Tech Domain, crafting seamless web solutions with advanced
          <br />
          technical expertise, delivering innovation and excellence.
        </p>
      </MotionDiv>

      <div className="relative max-w-3xl mx-auto mt-8">
        <div className="bg-[#EEF0FF] rounded-full px-4 py-2 md:px-7 md:py-4 flex items-center gap-2 md:gap-4 shadow-sm">

          {/* LEFT ARROW */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll Left"
            className="w-9 h-9 md:w-11 md:h-11 aspect-square rounded-full bg-[#FFD233] flex items-center justify-center shadow-md hover:scale-105 hover:bg-[#ffcf1a] transition flex-shrink-0">
            <FiChevronLeft size={18} className="md:text-[22px] text-black font-bold" />
          </button>

          {/* SLIDER */}
          <div
            ref={scrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-1 md:px-2 flex-1">
            {categories.map((cat, index) => (
              <button
                key={index}
                className="px-5 py-2 rounded-full bg-white text-sm font-medium shadow whitespace-nowrap hover:bg-[#6A38C2] hover:text-white transition" >
                {cat}
              </button>
            ))}
          </div>

          {/* RIGHT ARROW */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll Right"
            className="w-9 h-9 md:w-11 md:h-11 aspect-square rounded-full bg-[#FFD233] flex items-center justify-center shadow-md hover:scale-105 hover:bg-[#ffcf1a] transition flex-shrink-0" >
            <FiChevronRight size={18} className="md:text-[22px] text-black font-bold" />
          </button>


        </div>
      </div>
    </div>
  );
};

export default CategoryCarousel;
