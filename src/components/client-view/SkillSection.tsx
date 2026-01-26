"use client";

import React, { useRef } from "react";

import {
  FaHtml5,
  FaCss3Alt,
  FaBootstrap,
  FaJsSquare,
  FaReact,
  FaNodeJs,
} from "react-icons/fa";

import {
  SiTailwindcss,
  SiTypescript,
  SiNextdotjs,
  SiRedux,
  SiExpress,
  SiMongodb,
  SiRedis,
  SiSocketdotio,
  SiWebrtc,
} from "react-icons/si";

import { MdLocationOn } from "react-icons/md";
import { useSkill } from "@/hooks/gsap/useSkill";

/* ---------------- GSAP ICON ---------------- */
const GsapIcon = () => (
  <svg width="70" height="70" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="24" fill="#0AE448" />
    <text
      x="50%"
      y="55%"
      textAnchor="middle"
      fill="#000"
      fontSize="48"
      fontWeight="700"
      dy=".3em"
    >
      GSAP
    </text>
  </svg>
);

/* ---------------- TYPE ---------------- */
type Skill = {
  title: string;
  icon: React.ReactNode;
};

/* ---------------- SKILLS DATA ---------------- */
const skills: Skill[] = [
  { title: "HTML", icon: <FaHtml5 className="text-orange-500" /> },
  { title: "CSS", icon: <FaCss3Alt className="text-blue-500" /> },
  { title: "Bootstrap", icon: <FaBootstrap className="text-purple-600" /> },
  { title: "Tailwind", icon: <SiTailwindcss className="text-sky-400" /> },
  { title: "JavaScript", icon: <FaJsSquare className="text-yellow-400" /> },
  { title: "TypeScript", icon: <SiTypescript className="text-blue-600" /> },
  { title: "React JS", icon: <FaReact className="text-cyan-400" /> },
  { title: "Next JS", icon: <SiNextdotjs /> },
  { title: "Redux", icon: <SiRedux className="text-purple-500" /> },
  { title: "GSAP", icon: <GsapIcon /> },
  { title: "Node JS", icon: <FaNodeJs className="text-green-600" /> },
  { title: "Express JS", icon: <SiExpress /> },
  { title: "MongoDB", icon: <SiMongodb className="text-green-500" /> },
  { title: "Redis", icon: <SiRedis className="text-red-500" /> },
  { title: "Geolocation", icon: <MdLocationOn className="text-red-600" /> },
  { title: "Socket.IO", icon: <SiSocketdotio /> },
  { title: "Web RTC", icon: <SiWebrtc className="text-indigo-500" /> },
];

/* ---------------- COMPONENT ---------------- */
const SkillSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  /* ONLY CHANGE: GSAP logic moved to hook */
  useSkill({
    sectionRef,
    leftRef,
    rightRef,
  });

  return (
    <section ref={sectionRef} className="">
      <div className="max-w-7xl py-5 mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 flex flex-col lg:flex-row gap-4 relative">
        {/* ---------- LEFT CONTENT ---------- */}
        <div className="w-full lg:w-1/2">
          <div
            ref={leftRef}
            className="md:min-h-screen flex flex-col justify-center"
          >
            <div className="pb-4">
              <span className="px-5 py-2  rounded-full bg-[rgba(226,229,235,0.72)] text-[#F83002] text-[18px] abt font-extrabold text-center w-[20%] hurry-up">
                My <span className="text-[#6A38C2]">Skill</span>
              </span>
            </div>

            <h2 className="text-3xl lg:text-3xl font-bold text-gray-900 mb-5 leading-tight">
              My Experts Areas Where I Gained Skill
            </h2>

            <p className="text-black max-w-lg mb-4 text-justify">
              I specialize in building modern, scalable and high-performance web
              applications using cutting-edge frontend and backend technologies.
            </p>

            <p className="text-black max-w-lg mb-4 text-justify">
              Over time, I have worked on real-world projects that required
              clean architecture, reusable components, secure APIs, and smooth
              user experiences across devices.
            </p>

            <p className="text-black max-w-lg text-justify">
              My approach focuses on performance, maintainability, and
              future-ready solutions that align with business goals and user
              needs.
            </p>
          </div>
        </div>

        {/* ---------- RIGHT SECTION ---------- */}
        <div
          ref={rightRef}
          className="
            w-full lg:w-1/2
            py-0 lg:py-18
            grid
            grid-cols-3
            gap-4 sm:gap-6
          "
        >
          {skills.map((skill, index) => (
            <div
              key={index}
              className="
                skill-card skill-shadow
                bg-white  rounded-2xl 
                p-3 sm:p-5
                text-center transition
              "
            >
              <div
                className="
                  mx-auto flex items-center justify-center
                  rounded-full border mb-3

                  w-12 h-12 text-2xl
                  sm:w-14 sm:h-14 sm:text-3xl
                  lg:w-[100px] lg:h-[100px] lg:text-6xl
                "
              >
                {skill.icon}
              </div>

              <h3 className="text-gray-900 font-semibold text-sm">
                {skill.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillSection;
