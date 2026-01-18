"use client";

import { FaTimes, FaFilePdf } from "react-icons/fa";
import { About } from "@/store/aboutSlice";

type Props = {
  about: About;
  onClose: () => void;
};

export default function AboutViewModal({ about, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow flex flex-col">
        {/* ================= HEADER ================= */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">About Us Preview</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* ================= LEFT – IMAGE ================= */}
          <div className="md:col-span-1 flex justify-center items-start">
            {about.image ? (
              <img
                src={about.image}
                alt="About"
                className="max-h-[380px] w-auto object-contain"
              />
            ) : (
              <span className="text-gray-400 text-sm">No image available</span>
            )}
          </div>

          {/* ================= RIGHT – CONTENT + PDF ================= */}
          <div className="md:col-span-2 flex flex-col">
            {/* CONTENT (NORMAL FLOW) */}
            <div
              className="tiptap-editor"
              dangerouslySetInnerHTML={{ __html: about.content }}
            />

            {/* PDF JUST AFTER CONTENT */}
            {about.resume && (
              <div className="mt-4">
                <a
                  href={about.resume}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-red-600 text-sm font-medium"
                >
                  <FaFilePdf />
                  View PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
