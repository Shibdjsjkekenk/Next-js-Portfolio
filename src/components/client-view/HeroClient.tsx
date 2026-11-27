"use client";

import React, { ReactNode, useState, useEffect, useRef,useId } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Typewriter from "typewriter-effect";
import { useHero } from "@/hooks/gsap/useHero";
import { FaFacebookF, FaInstagram, FaGithub, FaLinkedinIn, FaGlobe } from "react-icons/fa";
import { SiReact, SiRedux, SiJavascript, SiNextdotjs, SiNodedotjs, SiAmazon, SiGoogle, SiFlipkart, SiHtml5, SiCss3, SiBootstrap } from "react-icons/si";
import type { Banner } from "@/store/bannerSlice";
import { getDB } from "@/lib/indexeddb";

type Props = { banner: Banner | null };

// cqw = % of the visual container width -> layout scales identically on mobile & desktop
const cq = (n: number) => `${n}cqw`;
const SHADOW = "shadow-[0_10px_30px_rgba(0,0,0,0.12)]";

const floating = (delay = 0) => ({
  y: [0, -6, 0],
  transition: { duration: 3.5, delay, repeat: Infinity, ease: "easeInOut" as const },
});

type PillProps = { left: string; top: string; width: number; icon: ReactNode; label: string; iconBg: string; delay: number };

const Pill = ({ left, top, width, icon, label, iconBg, delay }: PillProps) => (
  <motion.div
    animate={floating(delay)}
    className={`absolute z-30 rounded-full bg-white flex items-center ${SHADOW}`}
    style={{ left, top, width: cq(width), height: cq(8), paddingLeft: cq(1.4), gap: cq(1.6) }}
  >
    <div className={`rounded-full flex items-center justify-center shrink-0 ${iconBg}`} style={{ width: cq(5.6), height: cq(5.6), fontSize: cq(3.4) }}>
      {icon}
    </div>
    <span className="text-gray-900 font-medium whitespace-nowrap" style={{ fontSize: `clamp(9px, ${cq(2.5)}, 22px)` }}>{label}</span>
  </motion.div>
);

const brands = [
  // { Icon: SiMyntra, left: 27.5, top: 3, size: 9.5, rot: -10, color: "text-[#E8408A]", bg: "bg-white" },
  { Icon: SiAmazon, left: 19.5, top: 15.5, size: 13, rot: -12, color: "text-gray-900", bg: "bg-white" },
  { Icon: SiFlipkart, left: 7.5, top: 26, size: 13, rot: -14, color: "text-white", bg: "bg-[#2874F0]" },
  { Icon: SiGoogle, left: 15.5, top: 41, size: 14.5, rot: -8, color: "text-[#4285F4]", bg: "bg-white" },
];

const experienceTechnologies = [
  { Icon: SiCss3, color: "text-sky-600", bg: "bg-sky-100" },
  { Icon: SiBootstrap, color: "text-purple-600", bg: "bg-purple-100" },
  { Icon: SiHtml5, color: "text-orange-500", bg: "bg-orange-100" },
  { Icon: SiReact, color: "text-cyan-500", bg: "bg-cyan-100" },
  { Icon: SiRedux, color: "text-violet-500", bg: "bg-violet-100" },
  { Icon: SiJavascript, color: "text-yellow-500", bg: "bg-yellow-100" },
];

// Hand-drawn marker style curly arrow (draws itself on load)
const ARROW_BODY = "M14.0 16.0C18.3 14.8 29.7 10.3 40.0 9.0C50.3 7.7 64.7 6.5 76.0 8.0C87.3 9.5 99.2 12.7 108.0 18.0C116.8 23.3 124.0 31.6 129.0 40.0C134.0 48.4 136.8 61.8 138.0 68.5C139.2 75.2 137.4 76.3 136.2 79.9C135.0 83.6 133.2 87.2 131.0 90.4C128.8 93.5 126.0 96.5 123.0 99.0C120.0 101.4 116.6 103.5 113.2 105.0C109.8 106.6 106.2 107.6 102.8 108.2C99.4 108.8 96.0 108.9 93.0 108.6C90.0 108.3 87.2 107.5 85.0 106.5C82.8 105.5 81.0 104.0 79.8 102.5C78.6 101.0 78.0 99.2 78.0 97.5C78.0 95.8 78.6 94.0 79.8 92.5C81.0 91.0 82.8 89.5 85.0 88.5C87.2 87.5 90.0 86.7 93.0 86.4C96.0 86.1 99.4 86.2 102.8 86.8C106.2 87.4 109.8 88.4 113.2 90.0C116.6 91.5 120.0 93.6 123.0 96.0C126.0 98.5 128.8 101.5 131.0 104.6C133.2 107.8 135.0 111.4 136.2 115.1C137.4 118.7 138.0 122.7 138.0 126.5C138.0 130.3 137.4 134.3 136.2 137.9C135.0 141.6 133.2 145.2 131.0 148.4C128.8 151.5 126.0 154.5 123.0 157.0C120.0 159.4 116.6 161.5 113.2 163.0C109.8 164.6 106.2 165.6 102.8 166.2C99.4 166.8 96.0 166.9 93.0 166.6C90.0 166.3 87.2 165.5 85.0 164.5C82.8 163.5 81.0 162.0 79.8 160.5C78.6 159.0 78.0 157.2 78.0 155.5C78.0 153.8 78.6 152.0 79.8 150.5C81.0 149.0 82.8 147.5 85.0 146.5C87.2 145.5 90.0 144.7 93.0 144.4C96.0 144.1 99.4 144.2 102.8 144.8C106.2 145.4 109.8 146.4 113.2 148.0C116.6 149.5 120.0 151.6 123.0 154.0C126.0 156.5 128.8 159.5 131.0 162.6C133.2 165.8 135.0 169.4 136.2 173.1C137.4 176.7 138.0 180.7 138.0 184.5C138.0 188.3 137.4 192.3 136.2 195.9C135.0 199.6 133.2 203.2 131.0 206.4C128.8 209.5 126.0 212.5 123.0 215.0C120.0 217.4 116.6 219.5 113.2 221.0C109.8 222.6 106.2 223.6 102.8 224.2C99.4 224.8 96.0 224.9 93.0 224.6C90.0 224.3 87.2 223.5 85.0 222.5C82.8 221.5 81.0 220.0 79.8 218.5C78.6 217.0 78.0 215.2 78.0 213.5C78.0 211.8 78.6 210.0 79.8 208.5C81.0 207.0 82.8 205.5 85.0 204.5C87.2 203.5 90.0 202.7 93.0 202.4C96.0 202.1 99.4 202.2 102.8 202.8C106.2 203.4 109.8 204.4 113.2 206.0C116.6 207.5 120.0 209.6 123.0 212.0C126.0 214.5 128.8 217.5 131.0 220.6C133.2 223.8 135.0 227.4 136.2 231.1C137.4 234.7 137.2 236.3 138.0 242.5C138.8 248.7 138.2 260.1 141.0 268.0C143.8 275.9 147.7 284.3 155.0 290.0C162.3 295.7 172.8 301.0 185.0 302.0C197.2 303.0 213.8 299.3 228.0 296.0C242.2 292.7 255.7 284.7 270.0 282.0C284.3 279.3 299.3 278.3 314.0 280.0C328.7 281.7 343.7 289.0 358.0 292.0C372.3 295.0 386.3 297.3 400.0 298.0C413.7 298.7 426.7 295.0 440.0 296.0C453.3 297.0 468.0 299.7 480.0 304.0C492.0 308.3 502.3 314.0 512.0 322.0C521.7 330.0 530.7 341.3 538.0 352.0C545.3 362.7 551.3 377.3 556.0 386.0C560.7 394.7 564.3 401.0 566.0 404.0";
const ARROW_HEAD = "M568 364L566 404L531 385";

const ArrowDoodle = ({ className = "" }: { className?: string }) => {
  const ref = useRef<SVGSVGElement>(null);
  const gid = `arrowGrad${useId().replace(/:/g, "")}`;
  const inView = useInView(ref, { amount: 0.25 }); // once: false -> replays on scroll down & up

  const draw = (duration: number, delay: number) =>
    inView
      ? { pathLength: 1, opacity: 1, transition: { duration, delay, ease: "easeInOut" as const } }
      : { pathLength: 0, opacity: 0, transition: { duration: 0.25 } };

  return (
    <svg ref={ref} viewBox="0 0 600 430" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="540" y2="400">
          <stop offset="0" stopColor="#6A38C2" />
          <stop offset="1" stopColor="#E7000B" />
        </linearGradient>
      </defs>
      <motion.g
        animate={{ y: inView ? [0, 8, 0] : 0 }}
        transition={inView ? { duration: 2.4, delay: 3.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
        style={{ filter: "drop-shadow(0 4px 6px rgba(106,56,194,0.25))" }}
      >
        <motion.path
          d={ARROW_BODY}
          stroke={`url(#${gid})`}
          strokeWidth={3.5}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={draw(2.6, 0.15)}
        />
        <motion.path
          d={ARROW_HEAD}
          stroke="#E7000B"
          strokeWidth={3.5}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={draw(0.45, 2.7)}
        />
      </motion.g>
    </svg>
  );
};

const HeroClient: React.FC<Props> = ({ banner }) => {
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [cachedBanner, setCachedBanner] = useState<Banner | null>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useHero(socialRef);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const loadBanner = async () => {
      if (banner) return;
      try {
        const db = await getDB();
        if (!db) return;
        const cached = await db.get("hero", "active-banner");
        if (cached) setCachedBanner(cached);
      } catch (error) { console.error(error); }
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
      } catch (error) { console.error(error); }
    };
    saveBanner();
  }, [banner]);

  useEffect(() => { if (banner) setTypewriterKey((prev) => prev + 1); }, [banner]);

  const displayBanner = banner || cachedBanner;
  if (!displayBanner) return <div className="text-center py-10 text-gray-500">No active banner found.</div>;

  const splitTitle = displayBanner.title ? displayBanner.title.split(" ") : ["I", "am", "Shubhanshu", "Tiwari"];
  const iamPart = splitTitle.slice(0, 2).join(" ");
  const restPart = splitTitle.slice(2).join(" ");

  const experienceMatch = displayBanner.paragraph?.match(/(\d+(?:\.\d+)?)\s*\+?\s*years?/i);
  const experience = experienceMatch?.[1] || "3";

  const renderParagraph = (text?: string): ReactNode => {
    if (!text) return null;
    const regex = /\d+(?:\.\d+)?\s*\+?\s*years?/gi;
    const elements: ReactNode[] = [];
    let lastIndex = 0;
    text.replace(regex, (match, offset) => {
      if (offset > lastIndex) elements.push(<span key={lastIndex}>{text.slice(lastIndex, offset)}</span>);
      elements.push(<span key={offset} className="font-semibold text-[#6A38C2]">{match}</span>);
      lastIndex = offset + match.length;
      return match;
    });
    if (lastIndex < text.length) elements.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
    return elements;
  };

  const typewriterText = displayBanner.italicTitle ?? "Turning ideas into impactful digital solutions.";

  const containerVariants: Variants = { hidden: {}, show: { transition: { delayChildren: 0.25, staggerChildren: 0.35 } } };
  const itemVariants: Variants = { hidden: { opacity: 0, x: -25 }, show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } } };

  const socialLinks = [
    { href: "https://www.facebook.com/shubhanshu.tiwari.167", icon: <FaFacebookF className="text-blue-600" /> },
    { href: "https://www.instagram.com/phenomenalllt", icon: <FaInstagram className="text-pink-500" /> },
    { href: "https://github.com/Shibdjsjkekenk", icon: <FaGithub className="text-gray-800" /> },
    { href: "https://www.linkedin.com/in/tiwari-shubhanshu-93bb95267", icon: <FaLinkedinIn className="text-blue-700" /> },
    { href: "https://www.shubhanshutiwari.com", icon: <FaGlobe className="text-green-500" /> },
  ];

  return (
    <div className="relative z-10 mt-12 lg:mt-16 w-full flex justify-center">
      <div className="max-w-auto max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 pt-5 flex flex-col lg:flex-row items-center">

        {/* LEFT CONTENT */}
        <motion.div className="w-full lg:w-[50%] relative z-20" variants={containerVariants} initial="hidden" animate="show">
          <div className="flex flex-col gap-5 my-8 lg:my-10">
            <motion.div variants={itemVariants}>
              <div className="w-fit rounded-full px-7 py-2 relative hurry-up">
                <div className="absolute inset-0 rounded-full bg-white/30 pointer-events-none" />
                <span className="relative text-xl md:text-2xl font-bold gradient-background">Hello,</span>
              </div>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-[28px] sm:text-4xl xl:text-5xl font-bold leading-tight">
              <span className="text-gray-900">{iamPart}</span>{" "}
              <span className="text-[#6A38C2]">{restPart}</span>
            </motion.h1>

            <motion.h4 variants={itemVariants} className="text-[18px] lg:text-[21px] leading-relaxed font-medium text-gray-700">
              {renderParagraph(displayBanner.paragraph)}
            </motion.h4>

            <motion.h1 variants={itemVariants} className="text-[15px] lg:text-[20px] font-bold italic text-gray-800 min-h-[28px]">
              {mounted && <Typewriter key={typewriterKey} onInit={(typewriter) => typewriter.typeString(typewriterText).pauseFor(2000).deleteAll().start()} options={{ loop: true, delay: 50 }} />}
            </motion.h1>

            <motion.div ref={socialRef} variants={itemVariants} className="relative mt-5 flex flex-wrap gap-4">
              {socialLinks.map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="social-icon w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300">
                  {item.icon}
                </a>
              ))}

              {/* ARROW: sits beside social icons, overlaps the section below */}
                 <ArrowDoodle className="hidden lg:block absolute z-[60] pointer-events-none text-gray-900 lg:left-[21rem] lg:-top-3 lg:w-[33rem] lg:h-[23.65rem]" />
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT VISUAL SECTION (same layout on mobile + desktop) */}
        <div className="w-full lg:w-[50%] flex items-center justify-center relative mt-8 lg:mt-0">
          <div className="relative w-full max-w-[700px] mx-auto aspect-[850/800]" style={{ containerType: "inline-size" }}>

            {/* PERSON (from backend) */}
            <img
              src={displayBanner.image || "/assets/no-bg.webp"}
              alt="Shubhanshu Tiwari"
              className="absolute z-10 object-contain object-bottom pointer-events-none -left-[`1%] top-0 w-full h-full lg:left-[9%] lg:top-[2%] lg:w-[77%] lg:h-[91%]"
            />

            {/* decorative */}
            <span className="absolute text-gray-800 font-bold z-20" style={{ left: "6%", top: "50%", fontSize: cq(5.5) }}>+</span>
            <span className="absolute text-gray-800 font-bold z-20" style={{ left: "82.5%", top: "46%", fontSize: cq(5.5) }}>+</span>
            <span className="absolute z-20 bg-yellow-400" style={{ left: "8.5%", top: "10%", width: cq(6.6), height: cq(5.6), borderRadius: "100% 0 0 0" }} />
            <span className="absolute z-20 bg-blue-400" style={{ left: "90%", top: "58.5%", width: cq(5.8), height: cq(5.8), borderRadius: "100% 0 100% 100%" }} />

            {/* BRAND ICONS (tilted) */}
            {/* {brands.map(({ Icon, left, top, size, rot, color, bg }, i) => (
              <motion.div
                key={i}
                animate={floating(i * 0.4)}
                className={`absolute z-30 flex items-center justify-center ${bg} ${SHADOW}`}
                style={{ left: `${left}%`, top: `${top}%`, width: cq(size), height: cq(size), borderRadius: cq(size * 0.26), rotate: rot }}
              >
                <Icon className={color} style={{ fontSize: cq(size * 0.5) }} />
              </motion.div>
            ))} */}

            {/* RIGHT PILLS (staggered) */}
            <Pill left="63%" top="20.3%" width={19.5} delay={0} label="React Js" iconBg="bg-red-100" icon={<SiReact className="text-cyan-500" />} />
            <Pill left="67.4%" top="30.5%" width={24} delay={0.35} label="Redux" iconBg="bg-green-100" icon={<SiRedux className="text-green-500" />} />
            <Pill left="73.4%" top="40.5%" width={28} delay={0.7} label="Javascript" iconBg="bg-yellow-100" icon={<SiJavascript className="text-yellow-500" />} />

            {/* LEFT BOTTOM PILLS */}
            <Pill left="2.6%" top="70%" width={21.5} delay={0.2} label="Next.js" iconBg="bg-gray-900" icon={<SiNextdotjs className="text-white" />} />
            <Pill left="2.6%" top="80.5%" width={21.5} delay={0.6} label="Node js" iconBg="bg-green-100" icon={<SiNodedotjs className="text-green-600" />} />

            {/* EXPERIENCE CARD */}
            <motion.div
              animate={floating(0.4)}
              className="absolute z-40 bg-white border border-gray-100 shadow-[0_14px_40px_rgba(0,0,0,0.16)] flex flex-col justify-center"
              style={{ left: "60.5%", top: "75.5%", width: "33.5%", height: "22.5%", borderRadius: cq(3.2), padding: `${cq(1.8)} ${cq(2.2)}`, gap: cq(1.8) }}
            >
              <div className="flex items-center justify-between">
                {experienceTechnologies.map(({ Icon, color, bg }, i) => (
                  <div key={i} className={`rounded-full flex items-center justify-center shrink-0 shadow-[0_3px_8px_rgba(0,0,0,0.18)] ring-1 ring-white ${bg}`} style={{ width: cq(3.7), height: cq(3.7) }}>
                    <Icon className={color} style={{ fontSize: cq(2.1) }} />
                  </div>
                ))}
              </div>
              <div className="h-px w-full bg-gray-100" />
              <div>
                <h3 className="text-[#168B45] font-extrabold whitespace-nowrap leading-none tracking-wide" style={{ fontSize: cq(2.5) }}>{experience} YEAR +</h3>
                <p className="text-gray-900 font-bold leading-none" style={{ fontSize: cq(3.4), marginTop: cq(1.2) }}>Experience</p>
              </div>
            </motion.div>

          </div>
        </div>
          {/* MOBILE ARROW: below the image (desktop arrow is in the social row) */}
        <div className="lg:hidden relative w-full h-0 z-[60] pointer-events-none">
          <ArrowDoodle className="absolute left-1/2 -translate-x-1/2 top-2 text-gray-900 w-[16rem] h-[11.5rem]" />
        </div>
      </div>
    </div>
  );
};

export default HeroClient;