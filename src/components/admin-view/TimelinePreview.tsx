"use client";

import { useEffect } from "react";
import { useTimeline } from "@/hooks/useTimeline";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function TimelinePreview() {
  const {
    list,
    getAllTimelines,
    deleteTimelineById,
    setActiveTimeline,
  } = useTimeline();

  useEffect(() => {
    getAllTimelines();
  }, []);

  if (!list.length) {
    return (
      <div className="bg-white rounded-xl shadow p-5">
        <div className="text-sm text-gray-400 italic border border-dashed rounded-lg p-6 text-center">
          No timeline created yet…
        </div>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    toast(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-800">
            Are you sure you want to delete this timeline?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="px-3 py-1 border rounded text-sm"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                await deleteTimelineById(id);
                closeToast();
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col h-[520px]">
      <h2 className="font-semibold text-gray-800 text-lg mb-3">
        Timeline Preview
      </h2>

      {/* 🔥 SCROLL AREA */}
      <div className="timeline-scroll flex-1 overflow-y-auto space-y-4 pr-1">
        {list.map((item) => (
          <div
            key={item._id}
            className="relative group border rounded-xl p-4 bg-gray-50 hover:bg-white hover:shadow-md transition"
          >
            {/* HEADER */}
            <div className="flex justify-between mb-2">
              <span className="px-3 py-1 mb-2 rounded-full text-md font-semibold bg-gradient-to-r from-[#04728F] to-[#04728f82] text-white">
                {item.category}
              </span>

              <span className="text-xs text-gray-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* CONTENT */}
            <div
              className="tiptap-editor"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />

            {/* ACTIONS */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition flex gap-2">
              <button
                title="Edit"
                className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center hover:scale-105 transition"
                onClick={() => setActiveTimeline(item._id)}
              >
                <FaEdit size={14} />
              </button>

              <button
                title="Delete"
                className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-105 transition"
                onClick={() => handleDelete(item._id)}
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .timeline-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .timeline-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .timeline-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.25);
          border-radius: 10px;
        }

        .timeline-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.4);
        }

        /* Firefox */
        .timeline-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
        }
      `}</style>
    </div>
  );
}
