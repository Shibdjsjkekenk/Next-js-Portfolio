"use client";

import { FaPlus, FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import RichTextEditor from "@/common/RichTextEditor";
import { useTimeline } from "@/hooks/useTimeline";

export default function TimelineCreate() {
  const {
    list,
    createTimeline,
    updateTimelineById,
    activeTimelineId,
    setActiveTimeline,
  } = useTimeline();

  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  /* PREFILL FROM REDUX (NOT API) */
  useEffect(() => {
    if (!activeTimelineId) return;

    const timeline = list.find(t => t._id === activeTimelineId);
    if (timeline) {
      setCategory(timeline.category);
      setContent(timeline.content);
    }
  }, [activeTimelineId, list]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    const success = activeTimelineId
      ? await updateTimelineById(activeTimelineId, {
          category,
          content,
          isActive: true,
        })
      : await createTimeline({
          category,
          content,
          isActive: true,
        });

    setSaving(false);

    if (success) {
      setCategory("");
      setContent("");
      setActiveTimeline(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-4 h-[520px]">
      <div className="flex justify-between">
        <h2 className="font-semibold text-gray-800 text-lg">
          {activeTimelineId ? "Edit Timeline" : "Create Timeline"}
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
          ) : activeTimelineId ? (
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

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="e.g. Education, Deployment, Hobby"
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A38C2]"
      />

      <RichTextEditor
        value={content}
        onChange={setContent}
        minHeight="min-h-[240px]"
      />
    </div>
  );
}
