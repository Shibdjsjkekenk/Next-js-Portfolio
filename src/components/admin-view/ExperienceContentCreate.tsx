"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import RichTextEditor from "@/common/RichTextEditor";
import { useExperienceContent } from "@/hooks/useExperienceContent";

export default function ExperienceContentCreate() {
  const {
    list,
    createExperienceContent,
    updateExperienceContentById,
    activeExperienceId,
    setActiveExperienceId,
  } = useExperienceContent();

  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  //  Prefill Redux
  useEffect(() => {
    if (!activeExperienceId) return;

    const item = list.find(i => i._id === activeExperienceId);
    if (item) {
      setContent(item.content || "");
    }
  }, [activeExperienceId, list]);

  //  Save / Update
  const handleSave = async () => {
    if (saving) return;

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    setSaving(true);

    const success = activeExperienceId
      ? await updateExperienceContentById(activeExperienceId, {
        content,
        isActive: true,
      })
      : await createExperienceContent({
        content,
        isActive: true,
      });

    setSaving(false);

    if (success) {
      setContent("");
      setActiveExperienceId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow h-[520px] flex flex-col">
      <div className="flex justify-between items-center px-5 py-3 border-b">
        <h2 className="font-semibold text-gray-800 text-lg">
          {activeExperienceId ? "Edit Experience Content" : "Create Experience Content"}
        </h2>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-1.5 rounded-md
                     bg-[#6A38C2] text-white disabled:opacity-60"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving
            </>
          ) : activeExperienceId ? (
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
        <RichTextEditor
          key={activeExperienceId || "create"}
          value={content}
          onChange={setContent}
          minHeight="min-h-[300px]"
        />
      </div>

    </div>
  );
}
