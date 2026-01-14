"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAbout } from "@/hooks/useAbout";

const RichTextEditor = dynamic(
  () => import("@/common/RichTextEditor"),
  { ssr: false }
);

type Props = {
  onClose: () => void;
};

export default function AboutFormModal({ onClose }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const { createAbout } = useAbout();

  const handleSave = async () => {
    if (!content.trim()) return;

    setLoading(true);
    const success = await createAbout({ content });
    setLoading(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow p-5 space-y-4">

        <h2 className="text-lg font-bold">
          Create About Us
        </h2>

        {/* RICH TEXT EDITOR */}
        <RichTextEditor value={content} onChange={setContent} />

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded bg-[#6A38C2] text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
