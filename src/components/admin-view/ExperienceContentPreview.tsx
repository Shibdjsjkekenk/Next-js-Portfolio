"use client";

import { useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useExperienceContent } from "@/hooks/useExperienceContent";

export default function ExperienceContentPreview() {
  const {
    list,
    loading,
    getAllExperienceContents,
    deleteExperienceContentById,
    setActiveExperienceId,
  } = useExperienceContent();

  //  Fetch once
  useEffect(() => {
    getAllExperienceContents();
  }, []);

  const handleDelete = (id: string) => {
    toast.warn(
      ({ closeToast }) => (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Are you sure you want to delete this experience content?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="px-3 py-1 text-sm rounded border"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                await deleteExperienceContentById(id);
                closeToast();
              }}
              className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
      }
    );
  };

    //  empty state
  if (!loading && list.length === 0) {
    return (
      <div className="text-center text-gray-400 text-sm py-10">
        No experience content created yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-4 h-[520px] flex flex-col">
      <h2 className="font-semibold text-gray-800 text-lg">
        Experience Content Preview
      </h2>

      {/* ================= CONTENT LIST ================= */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {loading ? (
          <div className="text-center text-gray-400 text-sm">
            Loading experience content...
          </div>
        ) : (
          list.map((item) => (
            <div
              key={item._id}
              className="relative border rounded-xl p-4 bg-gray-50 hover:bg-white hover:shadow transition"
            >
              {/* CONTENT */}
              <div
                className="tiptap-editor"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />

              {/* ACTIONS */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  onClick={() => setActiveExperienceId(item._id)}
                  className="w-8 h-8 rounded-full bg-green-100 text-green-700
                             flex items-center justify-center hover:bg-green-200"
                >
                  <FaEdit size={14} />
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="w-8 h-8 rounded-full bg-red-100 text-red-700
                             flex items-center justify-center hover:bg-red-200"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
