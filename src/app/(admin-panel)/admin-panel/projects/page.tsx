"use client";

import { useState } from "react";
import { FaProjectDiagram, FaChevronDown } from "react-icons/fa";
import ProjectCard from "@/components/admin-view/ProjectCard";

export default function ProjectsPage() {
  const [activeView, setActiveView] = useState<"content" | "cards">("cards");
  const [open, setOpen] = useState(false);
  const [cardClicked, setCardClicked] = useState(false);

  return (
    <div className="space-y-4">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-xl py-3 px-5 shadow flex items-center justify-between relative">
        {/* LEFT */}
        <h1 className="flex items-center gap-2 font-bold text-gray-800 text-base sm:text-2xl">
          <FaProjectDiagram className="text-[#6A38C2]" />
          Projects
          <span className="text-xs sm:text-sm text-gray-500">
            ( Manage portfolio projects )
          </span>
        </h1>

        {/* RIGHT CUSTOM DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="
      flex items-center gap-2
      bg-[#6A38C2]
      border border-gray-300
      rounded-lg
      px-4 py-2
      text-sm
      shadow-sm
      text-white
      hover:bg-[#8964c9]
    "
          >
            {activeView === "content" ? "Content" : "Cards"}
            <FaChevronDown className="text-xs" />
          </button>

          {open && (
            <div
              className="
        absolute right-0 mt-1 w-36
        bg-white
        border border-gray-200
        rounded-lg
        shadow-lg
        z-50
      "
            >
              {/* Show only NON-active option */}
              {activeView !== "content" && (
                <button
                  onClick={() => {
                    setActiveView("content");
                    setOpen(false);
                    setCardClicked(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Content
                </button>
              )}

              {activeView !== "cards" && (
                <button
                  onClick={() => {
                    setActiveView("cards");
                    setOpen(false);
                    setCardClicked(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Cards
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= CONTENT AREA ================= */}
      <div className="">
        {/* CONTENT VIEW */}
        {activeView === "content" && (
          <span className="text-gray-400 text-sm sm:text-base">
            🚧 Coming Soon
          </span>
        )}

        {/* CARDS VIEW */}
        {activeView === "cards" && <ProjectCard />}
      </div>
    </div>
  );
}
