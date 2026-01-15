"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { FaTrash, FaUpload, FaFilePdf } from "react-icons/fa";
import { useAbout } from "@/hooks/useAbout";
import fileToBase64 from "@/utils/fileToBase64";

const RichTextEditor = dynamic(
  () => import("@/common/RichTextEditor"),
  { ssr: false }
);

type Props = {
  onClose: () => void;
};

export default function AboutFormModal({ onClose }: Props) {
  const { createAbout } = useAbout();

  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [pdf, setPdf] = useState<{ name: string; data: string } | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = async (file: File) => {
    const base64 = await fileToBase64(file);
    setImage(base64);
  };

  /* ================= PDF UPLOAD ================= */
  const handlePdfUpload = async (file: File) => {
    const base64 = await fileToBase64(file);
    setPdf({ name: file.name, data: base64 });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!content.trim()) return;

    setLoading(true);

    const success = await createAbout({
      content,
      image,
      resume: pdf?.data,
      isActive,
    });

    setLoading(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-xl shadow flex flex-col">

        {/* ================= HEADER (FIXED) ================= */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Create About Us</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {/* ================= BODY (SCROLLABLE) ================= */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

          {/* RICH TEXT */}
          <RichTextEditor value={content} onChange={setContent} />

          {/* IMAGE UPLOAD */}
          <div>
            <label className="font-medium text-sm">Image</label>

            {!image ? (
              <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer text-gray-500">
                <FaUpload className="mb-2" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    e.target.files && handleImageUpload(e.target.files[0])
                  }
                />
              </label>
            ) : (
              <div className="relative mt-2 w-48">
                <img src={image} className="rounded-lg border" />
                <button
                  onClick={() => setImage(null)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            )}
          </div>

          {/* PDF UPLOAD */}
          <div>
            <label className="font-medium text-sm">PDF / Resume</label>

            {!pdf ? (
              <label className="mt-2 flex items-center gap-2 border rounded-lg px-4 py-3 cursor-pointer text-gray-600">
                <FaFilePdf />
                Upload PDF
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) =>
                    e.target.files && handlePdfUpload(e.target.files[0])
                  }
                />
              </label>
            ) : (
              <div className="mt-2 flex items-center justify-between border rounded-lg px-4 py-2">
                <span className="text-sm truncate">{pdf.name}</span>
                <button
                  onClick={() => setPdf(null)}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>

          {/* ACTIVE / INACTIVE */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm">
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* ================= FOOTER (FIXED) ================= */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-[#6A38C2] text-white rounded disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}
