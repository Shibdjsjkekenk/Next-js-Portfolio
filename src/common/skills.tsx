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

export const skills = [
  { title: "HTML", icon: <FaHtml5 className="text-orange-500" /> },
  { title: "CSS", icon: <FaCss3Alt className="text-blue-500" /> },
  { title: "Bootstrap", icon: <FaBootstrap className="text-purple-600" /> },
  { title: "Tailwind", icon: <SiTailwindcss className="text-sky-400" /> },
  { title: "JavaScript", icon: <FaJsSquare className="text-yellow-400" /> },
  { title: "TypeScript", icon: <SiTypescript className="text-blue-600" /> },
  { title: "React JS", icon: <FaReact className="text-cyan-400" /> },
  { title: "Next JS", icon: <SiNextdotjs /> },
  { title: "Redux", icon: <SiRedux className="text-purple-500" /> },
  { title: "GSAP", icon: "GSAP" },
  { title: "Node JS", icon: <FaNodeJs className="text-green-600" /> },
  { title: "Express JS", icon: <SiExpress /> },
  { title: "MongoDB", icon: <SiMongodb className="text-green-500" /> },
  { title: "Redis", icon: <SiRedis className="text-red-500" /> },
  { title: "Geolocation", icon: <MdLocationOn className="text-red-600" /> },
  { title: "Socket.IO", icon: <SiSocketdotio /> },
  { title: "Web RTC", icon: <SiWebrtc className="text-indigo-500" /> },
];