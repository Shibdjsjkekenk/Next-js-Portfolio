"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import Image from "next/image";
import No1 from "@/assets/no-1.webp";
import NoBg from "@/assets/no-bg.webp";

import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
  FaGlobe,
} from "react-icons/fa";

import { useBanner } from "@/hooks/useBanner";
import type { Banner } from "@/store/bannerSlice";

const HeroSection: React.FC = () => {
  const { list: bannerList, loading } = useBanner();

  const [activeBanner, setActiveBanner] = useState<Banner | null>(null);
  const [typewriterKey, setTypewriterKey] = useState<number>(0);

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (bannerList && bannerList.length > 0) {
      const active = bannerList.find((banner) => banner.isActive);
      setActiveBanner(active ?? null);
      setTypewriterKey((prev) => prev + 1);
    }
  }, [bannerList]);

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center max-w-full relative z-10 mt-20 px-4">
        <div className="flex flex-col md:flex-row items-center max-w-7xl w-full gap-10 animate-pulse">
          {/* LEFT */}
          <div className="w-full md:w-1/2 space-y-5">
            <div className="w-[30%] md:w-[20%] h-10 bg-gray-300 rounded-full" />
            <div className="h-10 w-[70%] bg-gray-300 rounded-md" />
            <div className="h-10 w-[50%] bg-gray-300 rounded-md" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-300 rounded" />
              <div className="h-4 w-[90%] bg-gray-300 rounded" />
              <div className="h-4 w-[80%] bg-gray-300 rounded" />
            </div>
            <div className="h-6 w-[60%] bg-gray-300 rounded" />
            <div className="flex gap-4 mt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-300 rounded-full" />
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-1/2 flex justify-center p-4">
            <div className="w-[300px] md:w-[420px] h-[320px] md:h-[420px] bg-gray-300 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (!activeBanner) {
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        No active banner found.
      </div>
    );
  }

  /* ================= HELPERS ================= */
  const splitTitle = activeBanner.title
    ? activeBanner.title.split(" ")
    : ["I", "am", "Shubhanshu", "Tiwari"];

  const iamPart = splitTitle.slice(0, 2).join(" ");
  const restPart = splitTitle.slice(2).join(" ");

  const renderParagraph = (text?: string): ReactNode => {
    if (!text) return null;

    const regex = /\d+(\.\d+)?\s*years\+/gi;
    const elements: ReactNode[] = [];
    let lastIndex = 0;

    text.replace(regex, (match, _, offset) => {
      const start = offset;
      if (start > lastIndex) {
        elements.push(
          <span key={lastIndex}>{text.slice(lastIndex, start)}</span>
        );
      }
      elements.push(
        <span key={start} className="text-red-700 font-semibold">
          {match}
        </span>
      );
      lastIndex = start + match.length;
      return match;
    });

    if (lastIndex < text.length) {
      elements.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
    }

    return elements;
  };

  const typewriterText =
    activeBanner.italicTitle ??
    "Turning ideas into impactful digital solutions.";


  return (
    <div className="flex items-center justify-center max-w-full bg-[#f6f6f6de] relative z-10 mt-16">
      <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {/* LEFT */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col gap-5 my-10">
            <div className="bg-[rgba(226,229,235,0.72)] w-[30%] md:w-[20%] rounded-full px-4 py-1">
              <span className="text-xl md:text-2xl font-bold gradient-background">
                Hello,
              </span>
            </div>

            <h1 className="text-[28px] lg:text-5xl font-bold leading-[48px] md:leading-[56px]">
              <span className="text-gray-900">{iamPart}</span>{" "}
              <span className="text-[#6A38C2]">{restPart}</span>
            </h1>

            <h4 className="text-[18px] lg:text-[21px] font-medium text-gray-700">
              {renderParagraph(
                activeBanner.paragraph ??
                  "Crafting seamless web experiences with 2.5 years+ of professional expertise in modern web development."
              )}
            </h4>

            <h1 className="text-[15px] lg:text-[20px] font-bold italic text-gray-800 min-h-[28px]">
              <Typewriter
                key={typewriterKey}
                onInit={(typewriter) => {
                  typewriter
                    .typeString(typewriterText)
                    .pauseFor(2000)
                    .deleteAll()
                    .start();
                }}
                options={{ loop: true, delay: 50 }}
              />
            </h1>

            {/* SOCIAL */}
      {/* SOCIAL ICONS */}
            <div className="mt-6 flex space-x-4">
              <a href="https://www.facebook.com/shubhanshu.tiwari.167" target="_blank"
                className="w-10 h-10 border border-gray-300 p-1 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <FaFacebookF className="text-blue-600" />
              </a>

              <a href="https://www.instagram.com/phenomenalllt?igsh=MWtxM3dqMmg2bzl0cg=="
                target="_blank"
                className="w-10 h-10 border border-gray-300 p-1 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <FaInstagram className="text-pink-500" />
              </a>

              <a href="https://github.com/Shibdjsjkekenk"
                target="_blank"
                className="w-10 h-10 border border-gray-300 p-1 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <FaGithub className="text-gray-800" />
              </a>

              <a href="https://www.linkedin.com/in/tiwari-shubhanshu-93bb95267?trk=contact-info"
                target="_blank"
                className="w-10 h-10 border border-gray-300 p-1 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <FaLinkedinIn className="text-blue-700" />
              </a>

              <a href="https://www.shubhanshutiwari.com"
                target="_blank"
                className="w-10 h-10 border border-gray-300 p-1 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <FaGlobe className="text-green-500" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* RIGHT */}
        <div
          className="w-full md:w-1/2 flex items-center justify-center"
          style={{ backgroundImage: `url(${NoBg.src})` }}
        >
          <div className="bounce-custom">
            <Image
              src={activeBanner.image || No1}
              alt="Dynamic Banner"
              width={500}
              height={500}
              className="rounded-md md:ml-[20px] w-full"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
