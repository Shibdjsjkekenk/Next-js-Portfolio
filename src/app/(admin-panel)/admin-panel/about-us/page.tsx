"use client";

import { useState } from "react";
import { FaInfoCircle, FaPlus } from "react-icons/fa";
import AboutFormModal from "@/components/admin-view/AboutFormModal";
import { useAbout } from "@/hooks/useAbout";

export default function AboutUsPage() {
  const { list: abouts, loading } = useAbout();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-4">

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-xl py-3 px-5 shadow flex items-center">
        <h1 className="flex items-center gap-2 font-bold text-gray-800 text-base sm:text-2xl">
          <FaInfoCircle className="text-[#6A38C2]" />
          About Us
          <span className="text-xs sm:text-sm text-gray-500">
            ( Manage website content )
          </span>
        </h1>

        <button
          onClick={() => setShowCreate(true)}
          className="ml-auto px-4 py-2 text-sm rounded-md bg-[#6A38C2] text-white flex items-center gap-2"
        >
          <FaPlus />
          Create About Us
        </button>
      </div>

      {/* ================= LOADING ================= */}
      {loading && abouts.length === 0 && (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
          Loading About Us content...
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}
      {!loading && abouts.length === 0 && (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          No About Us content added yet.
        </div>
      )}

      {/* ================= FULL CONTENT RENDER ================= */}
      {abouts.map((about) => (
        <div
          key={about._id}
          className="bg-white rounded-xl shadow p-6 tiptap-editor"
        >
          <div
            dangerouslySetInnerHTML={{
              __html: about.content,
            }}
          />
        </div>
      ))}

      {/* ================= CREATE MODAL ================= */}
      {showCreate && (
        <AboutFormModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}
