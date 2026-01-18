"use client";

import { useState } from "react";
import {
  FaInfoCircle,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaFilePdf,
} from "react-icons/fa";
import Table from "@/common/Table";
import AboutFormModal from "@/components/admin-view/AboutFormModal";
import AboutViewModal from "@/components/admin-view/AboutViewModal";
import { useAbout } from "@/hooks/useAbout";
import { useDispatch } from "react-redux";
import { setActiveAbout } from "@/store/aboutSlice";
import { toast } from "react-toastify";
import type { About } from "@/store/aboutSlice";

export default function AboutUsPage() {
  const { list: abouts, loading, deleteAboutById } = useAbout();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ✅ VIEW MODAL KE LIYE – DIRECT OBJECT
  const [viewAbout, setViewAbout] = useState<About | null>(null);

  const toggleContent = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openCreate = () => {
    dispatch(setActiveAbout(null));
    setShowModal(true);
  };

  const openEdit = (id: string) => {
    dispatch(setActiveAbout(id));
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    toast(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="text-sm font-medium">
            Are you sure you want to delete this About Us content?
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
                await deleteAboutById(id);
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
    <div className="space-y-4">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-xl py-3 px-5 shadow flex items-center">
        <h1 className="flex items-center gap-2 font-bold text-gray-800 text-base sm:text-2xl">
          <FaInfoCircle className="text-[#6A38C2]" />
          About Us
          <span className="text-xs sm:text-sm text-gray-500">
            ( Manage website content )
          </span>
        </h1>

        <button
          onClick={openCreate}
          className="ml-auto px-4 py-2 text-sm rounded-md bg-[#6A38C2] text-white flex items-center gap-2"
        >
          <FaPlus />
          Create About Us
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading && abouts.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            Loading About Us content...
          </div>
        ) : (
          <Table
            headers={["No", "Image", "Content", "PDF", "Status", "Action"]}
          >
            {abouts.map((about, index) => (
              <tr key={about._id} className="align-middle">
                <td className="p-2 border text-center">{index + 1}</td>

                <td className="p-2 border text-center">
                  {about.image ? (
                    <img
                      src={about.image}
                      className="w-16 h-10 object-cover rounded mx-auto"
                    />
                  ) : (
                    "—"
                  )}
                </td>

                <td className="p-2 border max-w-[420px]">
                  <div
                    className={`text-sm ${
                      expandedId === about._id ? "" : "content-clamp"
                    }`}
                    dangerouslySetInnerHTML={{ __html: about.content }}
                  />
                  <button
                    onClick={() => toggleContent(about._id)}
                    className="text-xs text-blue-600 mt-1"
                  >
                    {expandedId === about._id ? "Less" : "+ More"}
                  </button>
                </td>

                <td className="p-2 border text-center">
                  {about.resume ? (
                    <a
                      href={about.resume}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-red-600"
                    >
                      <FaFilePdf /> View
                    </a>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="p-2 border text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      about.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {about.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-2 border text-center">
                  <div className="flex justify-center gap-2">
                    {/* 👁️ VIEW */}
                    <button
                      onClick={() => setViewAbout(about)}
                      className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      <FaEye />
                    </button>

                    {/* ✏️ EDIT */}
                    <button
                      onClick={() => openEdit(about._id)}
                      className="p-2 rounded-full bg-green-100 text-green-700"
                    >
                      <FaEdit />
                    </button>

                    {/* 🗑️ DELETE */}
                    <button
                      onClick={() => handleDelete(about._id)}
                      className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      {/* ================= MODALS ================= */}
      {showModal && <AboutFormModal onClose={() => setShowModal(false)} />}

      {viewAbout && (
        <AboutViewModal
          about={viewAbout}
          onClose={() => setViewAbout(null)}
        />
      )}

      {/* ================= STYLES ================= */}
      <style jsx global>{`
        .content-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4em;
          max-height: calc(1.4em * 2.5);
        }
      `}</style>
    </div>
  );
}
