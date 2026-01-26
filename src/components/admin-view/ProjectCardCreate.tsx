"use client";

import { useState, ChangeEvent } from "react";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import RichTextEditor from "@/common/RichTextEditor";

const ProjectCardCreate = () => {
  const [content, setContent] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /* IMAGE SELECT */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  /* IMAGE REMOVE */
  const removeImage = () => {
    setImagePreview(null);
  };

  return (
    <div className="bg-white rounded-xl shadow h-[520px] flex flex-col">
      {/* ================= STICKY HEADER ================= */}
      <div className="sticky top-0 z-10 bg-white rounded-xl border-b px-5 py-3 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 text-lg">Create Project</h2>

        <button
          disabled
          className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#6A38C2] text-white opacity-60 cursor-not-allowed"
        >
          <FaPlus size={12} /> Save
        </button>
      </div>

      {/* ================= SCROLLABLE CONTENT ================= */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
        
        {/* RICH TEXT CONTENT */}
        <RichTextEditor
          value={content}
          onChange={setContent}
          minHeight="min-h-[220px]"
        />

        {/* PROJECT LINK */}
        <input
          value={projectLink}
          onChange={(e) => setProjectLink(e.target.value)}
          placeholder="Project link (Live / GitHub)"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A38C2]"
        />

        {/* IMAGE UPLOAD / PREVIEW */}
        {!imagePreview ? (
          <label className="cursor-pointer block">
            <div className="border-2 border-dashed border-gray-300 rounded-xl h-28 flex flex-col items-center justify-center text-gray-500 hover:border-[#6A38C2] hover:text-[#6A38C2] transition">
              <FaUpload className="mb-2" />
              <span className="text-sm">Upload Image</span>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative w-full max-w-[260px] h-40 rounded-xl border bg-gray-50 flex items-center justify-center overflow-hidden">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />

            {/* REMOVE ICON */}
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-2 shadow hover:bg-red-50"
            >
              <FaTrash size={12} />
            </button>
          </div>
        )}
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.25);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ProjectCardCreate;
