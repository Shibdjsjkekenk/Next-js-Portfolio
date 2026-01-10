"use client";

import { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";
import Table from "@/common/Table";
import ViewBannerModal from "@/components/admin-view/ViewBannerModal";
import BannerFormModal from "@/components/admin-view/BannerFormModal";
import { useBanner } from "@/hooks/useBanner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function BannerPage() {
  const {
    list: banners,
    loading,
    activeBannerId,
    openBanner,
    closeBanner,
    deleteBannerById, 
  } = useBanner();

  const [editBanner, setEditBanner] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const activeBanner = useSelector((state: RootState) =>
    state.banner.list.find(b => b._id === activeBannerId)
  );


  const handleDelete = (id: string) => {
    toast.warn(
      ({ closeToast }) => (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Are you sure you want to delete this banner?
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
                await deleteBannerById(id);
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

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="bg-white rounded-xl py-3 px-5 shadow flex items-center">
        <h1 className="flex items-center gap-2 font-bold text-gray-800 text-base sm:text-2xl">
          <FaImage className="text-[#6A38C2]" />
          Banners
          <span className="text-xs sm:text-sm text-gray-500">
            ( Manage website banners )
          </span>
        </h1>

        {/* <button
          onClick={() => setShowCreate(true)}
          className="ml-auto px-4 py-2 text-sm rounded-md bg-[#6A38C2] text-white hover:opacity-90"
        >
          + Create Banner
        </button> */}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {loading && banners.length === 0 ? (
          <Table headers={["No", "Image", "Title", "Paragraph", "Status", "Action"]}>
            {[1].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="p-2 border"><div className="h-4 w-6 bg-gray-200 rounded" /></td>
                <td className="p-2 border"><div className="w-16 h-10 bg-gray-200 rounded" /></td>
                <td className="p-2 border"><div className="h-4 w-40 bg-gray-200 rounded" /></td>
                <td className="p-2 border"><div className="h-4 w-full bg-gray-200 rounded" /></td>
                <td className="p-2 border"><div className="h-6 w-16 bg-gray-200 rounded-full" /></td>
                <td className="p-2 border">
                  <div className="flex gap-2 justify-center">
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <Table headers={["No", "Image", "Title", "Paragraph", "Status", "Action"]}>
            {banners.map((banner, index) => (
              <tr key={banner._id} className="whitespace-nowrap">
                <td className="p-2 border">{index + 1}</td>

                <td className="p-2 border">
                  {banner.image ? (
                    <img src={banner.image} className="w-16 h-10 object-cover rounded" />
                  ) : "—"}
                </td>

                <td className="p-2 border">{banner.title}</td>

                <td className="p-2 border truncate max-w-[250px]">
                  {banner.paragraph}
                </td>

                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      banner.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-2 border">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => openBanner(banner._id)}
                      className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={() => setEditBanner(banner)}
                      className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(banner._id)}
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

      {activeBanner && (
        <ViewBannerModal banner={activeBanner} onClose={closeBanner} />
      )}

      {editBanner && (
        <BannerFormModal
          banner={editBanner}
          onClose={() => setEditBanner(null)}
        />
      )}

      {showCreate && (
        <BannerFormModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}
