"use client";

import { FaTimes, FaImage } from "react-icons/fa";

export default function ViewBannerModal({
  banner,
  onClose,
}: {
  banner: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">

        {/* STICKY HEADER */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b bg-white rounded-t-2xl">
          <h2 className="flex items-center gap-2 font-semibold text-gray-800">
            <FaImage className="text-[#6A38C2]" />
            Banner Details
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LEFT */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Title</p>
                <p className="font-semibold">{banner.title}</p>
              </div>

              {banner.italicTitle && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Italic Title
                  </p>
                  <p className="italic">{banner.italicTitle}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 uppercase">
                  Description
                </p>
                <p>{banner.paragraph}</p>
              </div>

              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    banner.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {banner.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* RIGHT */}
            <div className="flex items-center justify-center">
              {banner.image ? (
                <img
                  src={banner.image}
                  className="w-full max-h-[260px] object-cover rounded-xl border"
                />
              ) : (
                <div className="w-full h-[200px] flex items-center justify-center border rounded-xl text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
