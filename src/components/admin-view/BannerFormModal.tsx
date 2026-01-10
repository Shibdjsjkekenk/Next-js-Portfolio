"use client";

import { useEffect, useState } from "react";
import {
  FaTimes,
  FaSave,
  FaImage,
  FaUpload,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useBanner } from "@/hooks/useBanner";
import fileToBase64 from "@/utils/fileToBase64";

/* ================= TYPES ================= */

type Banner = {
  _id: string;
  title: string;
  paragraph: string;
  italicTitle?: string;
  image?: string;
  isActive: boolean;
};

type Props = {
  banner?: Banner | null;
  onClose: () => void;
};

export default function BannerFormModal({ banner, onClose }: Props) {
  const isEdit = Boolean(banner);
  const { createBanner, updateBannerById } = useBanner();

  /* ================= FORM STATE ================= */

  const [form, setForm] = useState({
    title: "",
    paragraph: "",
    italicTitle: "",
    image: "",
    isActive: true,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  /* ================= PREFILL (EDIT) ================= */

  useEffect(() => {
    if (banner) {
      setForm({
        title: banner.title,
        paragraph: banner.paragraph,
        italicTitle: banner.italicTitle || "",
        image: banner.image || "",
        isActive: banner.isActive,
      });

      if (banner.image) {
        setImagePreview(banner.image);
      }
    }
  }, [banner]);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setForm(prev => ({ ...prev, isActive: !prev.isActive }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  /* ================= IMAGE HANDLERS (FIXED) ================= */

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);

      setImagePreview(base64);  
      setForm(prev => ({ ...prev, image: base64 }));
    } catch {
      toast.error("Failed to read image");
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setForm(prev => ({ ...prev, image: "" }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!form.title || !form.paragraph) {
      toast.error("Title and Paragraph are required");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        image: imagePreview,
      };

      if (isEdit && banner) {
        await updateBannerById(banner._id, payload);
      } else {
        await createBanner(payload);
      }

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="flex items-center gap-2 font-semibold text-gray-800">
            <FaImage className="text-[#6A38C2]" />
            {isEdit ? "Edit Banner" : "Create Banner"}
          </h2>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <FaTimes />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4 overflow-y-auto">

          {/* TITLE */}
          <div>
            <label className="text-sm font-medium">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* ITALIC TITLE */}
          <div>
            <label className="text-sm font-medium">Italic Title</label>
            <input
              name="italicTitle"
              value={form.italicTitle}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* PARAGRAPH */}
          <div>
            <label className="text-sm font-medium">Paragraph *</label>
            <textarea
              name="paragraph"
              value={form.paragraph}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm resize-none"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="text-sm font-medium block mb-1">Image</label>

            {!imagePreview ? (
              <label className="flex gap-2 items-center justify-center border-2 border-dashed rounded-xl py-6 cursor-pointer text-gray-600">
                <FaUpload />
                Upload Image
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative w-[200px]">
                <img
                  src={imagePreview}
                  className="w-full h-[220px] object-cover rounded-xl border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-600 text-white p-2 rounded-full"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            )}
          </div>

          {/* STATUS */}
          <label className="flex gap-2 items-center text-sm font-medium">
            <input type="checkbox" checked={form.isActive} onChange={handleChange} />
            Active
          </label>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-md text-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-[#6A38C2] text-white rounded-md flex gap-2 items-center"
          >
            <FaSave />
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
