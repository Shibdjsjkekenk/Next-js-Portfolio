"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
    <div className="w-full pt-20 pb-10 text-center">
      {/* ================= HEADING ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">
          Expert in Tech <span className="text-[#6A38C2]">Domain....</span>
        </h1>

        <p className="mt-2 text-gray-700">
          "Expert in the Tech Domain, crafting seamless web solutions with advanced
          <br />
          technical expertise, delivering innovation and excellence."
        </p>
      </motion.div>

      {/* ================= CAROUSEL ================= */}
      <div className="relative max-w-3xl mx-auto mt-8">
        <div className="bg-[#EEF0FF] rounded-full px-7 py-4 flex items-center gap-4 shadow-sm">

          {/* LEFT ARROW */}
         <button
  onClick={() => scroll("left")}
  aria-label="Scroll Left"
  className="
    w-11 h-11 aspect-square rounded-full
    bg-[#FFD233]
    flex items-center justify-center
    shadow-md
    hover:scale-105 hover:bg-[#ffcf1a]
    transition
  "
>
  <FiChevronLeft size={22} className="text-black font-bold" />
</button>


          {/* SLIDER */}
          <div
            ref={scrollRef}
            className="
              flex gap-4 overflow-x-auto
              scroll-smooth scrollbar-hide px-2
            "
          >
            {categories.map((cat, index) => (
              <button
                key={index}
                className="
                  px-5 py-2 rounded-full
                  bg-white text-sm font-medium
                  shadow whitespace-nowrap
                  hover:bg-[#6A38C2]
                  hover:text-white
                  transition
                "
              >
                {cat}
              </button>
            ))}
          </div>

          {/* RIGHT ARROW */}
      <button
  onClick={() => scroll("right")}
  aria-label="Scroll Right"
  className="
    w-11 h-11 aspect-square rounded-full
    bg-[#FFD233]
    flex items-center justify-center
    shadow-md
    hover:scale-105 hover:bg-[#ffcf1a]
    transition
  "
>
  <FiChevronRight size={22} className="text-black font-bold" />
</button>

        </div>
      </div>

      {/* SCROLLBAR HIDE */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryCarousel;
