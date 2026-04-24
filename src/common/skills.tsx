import {
  FaHtml5,
  FaCss3Alt,
  FaBootstrap,
  FaJsSquare,
  FaReact,
  FaNodeJs,
  FaRobot
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
  SiOpenai,
  SiNginx,
  SiGithubactions,
  SiChainlink
} from "react-icons/si";

import { FaAws, FaDatabase } from "react-icons/fa";

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
  { title: "GSAP", icon: <span className="text-2xl font-bold text-green-500">GSAP</span> },
  { title: "Node JS", icon: <FaNodeJs className="text-green-600" /> },
  { title: "Express JS", icon: <SiExpress /> },
  { title: "MongoDB", icon: <SiMongodb className="text-green-500" /> },
  { title: "Redis", icon: <SiRedis className="text-red-500" /> },
  { title: "Geolocation", icon: <MdLocationOn className="text-red-600" /> },
  { title: "Socket.IO", icon: <SiSocketdotio /> },
  { title: "Gen AI", icon: <SiOpenai className="text-green-500" /> },
  { title: "AI Agent", icon: <FaRobot className="text-gray-700" /> },
  { title: "RAG", icon: <FaDatabase className="text-indigo-500" /> },
  { title: "LangChain", icon: <SiChainlink className="text-green-600" /> },
  { title: "AWS", icon: <FaAws className="text-orange-500" /> },
  { title: "NGINX", icon: <SiNginx className="text-green-600" /> },
  { title: "CI/CD", icon: <SiGithubactions className="text-blue-500" /> },
];