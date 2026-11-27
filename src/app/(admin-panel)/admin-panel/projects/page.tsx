"use client";

import { useState } from "react";
import { FaProjectDiagram, FaChevronDown, FaSearch } from "react-icons/fa";
import ExperienceContent from "@/components/admin-view/ExperienceContent";
import ProjectCard from "@/components/admin-view/ProjectCard";
import SearchInput from "@/common/SearchInput";

export default function ProjectsPage() {
  const [activeView, setActiveView] = useState<"content" | "cards">("cards");
  const [open, setOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-4">

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-xl py-3 px-5 shadow flex items-center justify-between gap-4 flex-wrap">

        {/* LEFT */}
        <h1 className="flex items-center gap-2 font-bold text-gray-800 text-base sm:text-2xl whitespace-nowrap">
          <FaProjectDiagram className="text-[#6A38C2]" />
          Projects
          <span className="text-xs sm:text-sm text-gray-500">
            ( Manage portfolio projects )
          </span>
        </h1>

        {/* RIGHT */}
        <div className="flex items-center gap-3 shrink-0">

          {activeView === "cards" && (
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search projects..."
            />
          )}
          {/* ================= SORT FILTER ================= */}
          {/* {activeView === "cards" && (
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 bg-[#6A38C2] rounded-lg px-4 py-2 text-sm text-white hover:bg-[#7c4ed9] transition"
              >
                {sortOrder === "latest" ? "Last → First" : "First → Last"}
                <FaChevronDown className="text-xs" />
              </button>

              {sortOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-50">
                  {sortOrder !== "latest" && (
                    <button
                      onClick={() => {
                        setSortOrder("latest");
                        setSortOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Last → First
                    </button>
                  )}

                  {sortOrder !== "oldest" && (
                    <button
                      onClick={() => {
                        setSortOrder("oldest");
                        setSortOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      First → Last
                    </button>
                  )}
                </div>
              )}
            </div>
          )} */}

          {/* ================= VIEW SWITCH ================= */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-[#6A38C2] rounded-lg px-4 py-2 text-sm text-white"
            >
              {activeView === "content" ? "Content" : "Cards"}
              <FaChevronDown className="text-xs" />
            </button>

            {open && (
              <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-lg z-50">
                {activeView !== "content" && (
                  <button
                    onClick={() => {
                      setActiveView("content");
                      setOpen(false);
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
      </div>

      {/* ================= CONTENT ================= */}
      {activeView === "content" && <ExperienceContent />}

      {activeView === "cards" && (
        <ProjectCard sortOrder={sortOrder} search={search} />
      )}
    </div>
  );
}