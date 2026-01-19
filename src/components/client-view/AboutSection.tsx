"use client";

import React from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

type About = {
  image?: string;
  content?: string;
  resume?: string;
};

const AboutSection = ({ about }: { about: About | null }) => {
  /* =======================
     NO DATA SAFETY
     ======================= */
  if (!about) return null;

  /* =======================
     REAL CONTENT
     ======================= */
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
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
            dangerouslySetInnerHTML={{ __html: about.content || "" }}
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
  bg-[#6A38C2]
  shadow-[0_2px_8px_rgba(99,99,99,0.88)]
  transition-all duration-300
  hover:scale-105 active:scale-95
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
