"use client";

import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";

type Props = {
  project: {
    projectImage: string;
    content: string;
    projectLink: string;
  };
  onClose: () => void;
};

export default function ProjectCardView({ project, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full
                     bg-white/80 backdrop-blur text-gray-600 hover:text-black"
        >
          <FaTimes size={14} />
        </button>

        {/* IMAGE */}
        {project.projectImage && (
          <div className="h-44 w-full p-5 overflow-hidden bg-gray-100">
            <img
              src={project.projectImage}
              alt="Project"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* CONTENT */}
        <div className="p-5 space-y-4">
          <div
            className="tiptap-editor text-sm text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />

          {/* ACTION */}
          <div className="pt-2">
            <a
              href={project.projectLink}
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm
                         rounded-lg bg-[#6A38C2] text-white
                         hover:bg-[#5a2fb0] transition"
            >
              View Project
              <FaExternalLinkAlt size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
