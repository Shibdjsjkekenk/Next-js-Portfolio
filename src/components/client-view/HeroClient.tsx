"use client";

import React, { ReactNode, useState, useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import Typewriter from "typewriter-effect";
import { useHero } from "@/hooks/gsap/useHero";
import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
  FaGlobe,
} from "react-icons/fa";

import type { Banner } from "@/store/bannerSlice";
import { getDB } from "@/lib/indexeddb";

type Props = {
  banner: Banner | null;
};

const HeroClient: React.FC<Props> = ({ banner }) => {
  const [typewriterKey, setTypewriterKey] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [cachedBanner, setCachedBanner] = useState<Banner | null>(null);

  const socialRef = useRef<HTMLDivElement>(null);

  useHero(socialRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadBanner = async () => {
      if (banner) return;

      try {
        const db = await getDB();
        if (!db) return;

        const cached = await db.get("hero", "active-banner");

        if (cached) {
          setCachedBanner(cached);

          // console.log("✅ Banner loaded from IndexedDB");
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadBanner();
  }, [banner]);

  useEffect(() => {
    const saveBanner = async () => {
      if (!banner) return;

      try {
        const db = await getDB();
        if (!db) return;

        await db.put("hero", banner, "active-banner");

        // console.log("✅ Banner saved to IndexedDB");
      } catch (error) {
        console.error(error);
      }
    };

    saveBanner();
  }, [banner]);

  useEffect(() => {
    if (banner) {
      setTypewriterKey((prev) => prev + 1);
    }
  }, [banner]);

  const displayBanner = banner || cachedBanner;

  if (!displayBanner) {
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        No active banner found.
      </div>
    );
  }

  /* ================= HELPERS ================= */
  const splitTitle = displayBanner.title
    ? displayBanner.title.split(" ")
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
          <span key={lastIndex}>{text.slice(lastIndex, start)}</span>,
        );
      }
      elements.push(
        <span key={start} className="text-red-700 font-semibold">
          {match}
        </span>,
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
    displayBanner.italicTitle ??
    "Turning ideas into impactful digital solutions.";

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: 0.25,
        staggerChildren: 0.35,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -25,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex items-center justify-center max-w-full relative z-10 mt-16 ">
      <div
        className="
    flex flex-col md:flex-row items-center
    max-w-7xl mx-auto
    px-4 sm:px-6 lg:px-10 xl:px-16
    pt-5
  "
      >
        {/* LEFT */}
        <motion.div
          className="w-full md:w-1/2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="flex flex-col gap-5 my-10">
            {/* HELLO */}
            <motion.div variants={itemVariants}>
              <div
                className="
    w-[30%] md:w-[20%]
    rounded-full
    px-5 py-1.5
 hurry-up
    relative
  "
              >
                {/* Top highlight */}
                <div className="absolute inset-0 rounded-full bg-white/30 pointer-events-none" />

                <span className="relative text-xl md:text-2xl font-bold gradient-background">
                  Hello,
                </span>
              </div>
            </motion.div>

            {/* NAME */}
            <motion.h1
              variants={itemVariants}
              className="text-[28px] lg:text-5xl font-bold leading-[48px] md:leading-[56px]"
            >
              <span className="text-gray-900">{iamPart}</span>{" "}
              <span className="text-[#6A38C2]">{restPart}</span>
            </motion.h1>

            {/* PARAGRAPH */}
            <motion.h4
              variants={itemVariants}
              className="text-[18px] lg:text-[21px] font-medium text-gray-700"
            >
              {renderParagraph(displayBanner.paragraph)}
            </motion.h4>

            {/* TYPEWRITER */}
            <motion.h1
              variants={itemVariants}
              className="text-[15px] lg:text-[20px] font-bold italic text-gray-800 min-h-[28px]"
            >
              {mounted && (
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
              )}
            </motion.h1>

            {/* SOCIAL ICONS */}
            <motion.div
              ref={socialRef}
              variants={itemVariants}
              className="mt-6 flex space-x-4"
            >
              {[
                {
                  href: "https://www.facebook.com/shubhanshu.tiwari.167",
                  icon: <FaFacebookF className="text-blue-600" />,
                },
                {
                  href: "https://www.instagram.com/phenomenalllt",
                  icon: <FaInstagram className="text-pink-500" />,
                },
                {
                  href: "https://github.com/Shibdjsjkekenk",
                  icon: <FaGithub className="text-gray-800" />,
                },
                {
                  href: "https://www.linkedin.com/in/tiwari-shubhanshu-93bb95267",
                  icon: <FaLinkedinIn className="text-blue-700" />,
                },
                {
                  href: "https://www.shubhanshutiwari.com",
                  icon: <FaGlobe className="text-green-500" />,
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  className="social-icon w-10 h-10 border border-gray-300 p-1 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT */}
        <div
          className="w-full md:w-1/2 flex items-center justify-center"
          style={{ backgroundImage: "url('/assets/no-bg.webp')" }}
        >
          <div className="bounce-custom">
            <img
              src={displayBanner.image}
              alt="Dynamic Banner"
              className="rounded-md md:ml-[20px] w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroClient;
