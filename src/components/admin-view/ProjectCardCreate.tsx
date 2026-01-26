"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { FaPlus, FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import RichTextEditor from "@/common/RichTextEditor";
import { useProjects } from "@/hooks/useProjects";
import fileToBase64 from "@/utils/fileToBase64";

export default function ProjectCardCreate() {
  const {
    list,
    createProject,
    updateProjectById,
    activeProjectId,
    setActiveProject,
  } = useProjects();

  const [content, setContent] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* ================= PREFILL FROM REDUX ================= */
  useEffect(() => {
    if (!activeProjectId || list.length === 0) return;

    const project = list.find((p) => p._id === activeProjectId);

    if (project) {
      setContent(project.content || "");
      setProjectLink(project.projectLink || "");
      setImagePreview(project.projectImage || null);
      setImageFile(null);
    }
  }, [activeProjectId, list]);

  /* ================= IMAGE HANDLERS ================= */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  /* ================= SAVE / UPDATE ================= */
  const handleSave = async () => {
    if (saving) return;

    if (!content.trim()) {
      toast.error("Project content is required");
      return;
    }

    if (!projectLink.trim()) {
      toast.error("Project link is required");
      return;
    }

    if (!imagePreview) {
      toast.error("Project image is required");
      return;
    }

    setSaving(true);

    let projectImage = imagePreview;

    // convert only if new file selected
    if (imageFile) {
      projectImage = await fileToBase64(imageFile);
    }

    const success = activeProjectId
      ? await updateProjectById({
          id: activeProjectId,
          content,
          projectLink,
          projectImage,
          isActive: true,
        })
      : await createProject({
          content,
          projectLink,
          projectImage,
          isActive: true,
        });

    setSaving(false);

    if (success) {
      setContent("");
      setProjectLink("");
      setImageFile(null);
      setImagePreview(null);
      setActiveProject(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow h-[520px] flex flex-col">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center px-5 py-3 border-b">
        <h2 className="font-semibold text-gray-800 text-lg">
          {activeProjectId ? "Edit Project" : "Create Project"}
        </h2>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#6A38C2] text-white disabled:opacity-60"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving
            </>
          ) : activeProjectId ? (
            <>
              <FaEdit size={12} /> Update
            </>
          ) : (
            <>
              <FaPlus size={12} /> Save
            </>
          )}
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
        {/* RICH TEXT */}
        <RichTextEditor
          key={activeProjectId || "create"}
          value={content}
          onChange={setContent}
          minHeight="min-h-[220px]"
        />

        {/* LINK */}
        <input
          value={projectLink}
          onChange={(e) => setProjectLink(e.target.value)}
          placeholder="Project link (Live / GitHub)"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A38C2]"
        />

        {/* IMAGE */}
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
}
