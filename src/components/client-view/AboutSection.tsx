"use client";

import React from "react";
import { useAbout } from "@/hooks/useAbout";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

const AboutSection = () => {
  const { list: abouts, loading } = useAbout();
  const about = abouts?.[0];

  /* =======================
     SKELETON LOADING
     ======================= */
  if (loading) {
    return (
      <section className="py-16 bg-white animate-pulse">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* LEFT IMAGE SKELETON */}
          <div className="flex justify-center">
            <div className="w-[550px] h-[420px] rounded-xl bg-gray-200" />
          </div>

          {/* RIGHT CONTENT SKELETON */}
          <div>
            {/* About Us pill */}
            <div className="pb-7">
              <div className="h-10 w-40 rounded-full bg-gray-200" />
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <div className="h-10 w-3/4 bg-gray-200 rounded" />
              <div className="h-6 w-full bg-gray-200 rounded" />
              <div className="h-6 w-11/12 bg-gray-200 rounded" />
              <div className="h-6 w-10/12 bg-gray-200 rounded" />
            </div>

            {/* Paragraph */}
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-11/12 bg-gray-200 rounded" />
              <div className="h-4 w-10/12 bg-gray-200 rounded" />
              <div className="h-4 w-9/12 bg-gray-200 rounded" />
            </div>

            {/* Button skeleton */}
            <div className="mt-8">
              <div className="h-12 w-48 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* =======================
     NO DATA
     ======================= */
  if (!about) return null;

  /* =======================
     REAL CONTENT
     ======================= */
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* LEFT IMAGE */}
        <div className="flex justify-center">
          {about.image && (
            <img
              src={about.image}
              alt="About"
              className="w-[550px] object-contain"
            />
          )}
        </div>

        {/* RIGHT CONTENT */}
        <div>
          <div className="pb-7">
            <span className="px-6 py-2 rounded-full bg-[rgba(226,229,235,0.72)] text-[#F83002] text-[18px] abt font-extrabold text-center w-[25%] hurry-up">
              About <span className="text-[#6A38C2]">Us</span>
            </span>
          </div>

          <div
            className="tiptap-editor"
            dangerouslySetInnerHTML={{ __html: about.content }}
          />

          {about.resume && (
            <div className="mt-6">
              <a
                href={about.resume}
                target="_blank"
                rel="noopener noreferrer"
                download="resume.pdf"
                className="
                  group inline-flex items-center gap-4
                  text-white font-semibold text-lg
                  px-6 py-2 rounded-full
                  shadow-lg
                  transition-all duration-300
                  hover:scale-105 active:scale-95
                  focus-visible:ring-offset-2 focus-visible:ring-[#6A38C2]
                  bg-[#6A38C2]
                "
              >
                <span>Download CV</span>

                <span
                  className="
                    flex items-center justify-center
                    w-9 h-9 rounded-full
                    bg-[#FF6A3D]
                    transition-transform duration-300
                    group-hover:rotate-45
                  "
                >
                  <FaArrowUpRightFromSquare className="text-white text-sm" />
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
