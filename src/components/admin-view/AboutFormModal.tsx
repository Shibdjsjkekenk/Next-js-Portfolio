"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FaTrash, FaUpload, FaFilePdf } from "react-icons/fa";
import { useAbout } from "@/hooks/useAbout";
import fileToBase64 from "@/utils/fileToBase64";
import { useRouter } from "next/navigation";

const RichTextEditor = dynamic(() => import("@/common/RichTextEditor"), {
  ssr: false,
});

type Props = {
  onClose: () => void;
};

export default function AboutFormModal({ onClose }: Props) {
  const { list, activeAboutId, createAbout, updateAboutById } = useAbout();

  const isEdit = Boolean(activeAboutId);
  const activeAbout = list.find((a) => a._id === activeAboutId);

  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [pdf, setPdf] = useState<{ name: string; data: string } | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /* PREFILL IN EDIT MODE */
  useEffect(() => {
    if (isEdit && activeAbout) {
      setContent(activeAbout.content);
      setImage(activeAbout.image || null);
      setPdf(
        activeAbout.resume
          ? { name: "Existing PDF", data: activeAbout.resume }
          : null,
      );
      setIsActive(activeAbout.isActive);
    }
  }, [isEdit, activeAbout]);

  const handleSave = async () => {
    if (!content.trim()) return;

    setLoading(true);

    const payload = {
      content,
      image,
      resume: pdf?.data || null,
      isActive,
    };

    const success = isEdit
      ? await updateAboutById(activeAboutId!, payload)
      : await createAbout(payload);

    setLoading(false);

    if (success) {
      router.refresh();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-xl shadow flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="text-lg font-bold">
            {isEdit ? "Edit About Us" : "Create About Us"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <RichTextEditor value={content} onChange={setContent} />

          {/* IMAGE */}
          {!image ? (
            <label className="border-dashed border p-6 rounded-lg cursor-pointer flex flex-col items-center">
              <FaUpload />
              Upload Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files &&
                  fileToBase64(e.target.files[0]).then(setImage)
                }
              />
            </label>
          ) : (
            <div className="relative w-48">
              <img src={image} className="rounded" />
              <button
                onClick={() => setImage(null)}
                className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
              >
                <FaTrash size={12} />
              </button>
            </div>
          )}

          {/* PDF */}
          {!pdf ? (
            <label className="border p-3 rounded cursor-pointer flex gap-2 items-center">
              <FaFilePdf />
              Upload PDF
              <input
                hidden
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  e.target.files &&
                  fileToBase64(e.target.files[0]).then((base64) =>
                    setPdf({ name: e.target.files![0].name, data: base64 }),
                  )
                }
              />
            </label>
          ) : (
            <div className="flex justify-between border p-2 rounded">
              <span>{pdf.name}</span>
              <button onClick={() => setPdf(null)}>
                <FaTrash />
              </button>
            </div>
          )}

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            {isActive ? "Active" : "Inactive"}
          </label>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSave}
            className="bg-[#6A38C2] text-white px-5 py-2 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
