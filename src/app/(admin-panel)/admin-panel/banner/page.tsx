"use client";

import { FaEye, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import Table from "@/common/Table";
import ViewBannerModal from "@/components/admin-view/ViewBannerModal";
import { useBanner } from "@/hooks/useBanner";

export default function BannerPage() {
  const {
    list: banners,
    loading,
    fetchedOnce,
    getBannerById,
    selectedBanner,
    setSelectedBanner,
    deleteBannerById,
  } = useBanner();

  const handleView = (banner: any) => {
    setSelectedBanner(banner);
    getBannerById(banner._id); // background enrich
  };
  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="bg-white rounded-xl py-3 px-5 shadow">
        <h1 className="flex items-center gap-2 font-bold text-gray-800 text-base sm:text-2xl">
          <FaImage className="text-[#6A38C2]" />
          Banners
          <span className="text-xs sm:text-sm text-gray-500">
            ( Manage website banners )
          </span>
        </h1>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {loading && banners.length === 0 ? (
          <Table headers={["No", "Image", "Title", "Paragraph", "Status", "Action"]}>
            {[1].map((_, index) => (   // 🔥 1 skeleton row
              <tr key={index} className="animate-pulse">

                <td className="p-2 border">
                  <div className="h-4 w-6 bg-gray-200 rounded" />
                </td>

                <td className="p-2 border">
                  <div className="w-16 h-10 bg-gray-200 rounded" />
                </td>

                <td className="p-2 border">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                </td>

                <td className="p-2 border">
                  <div className="h-4 w-full max-w-[260px] bg-gray-200 rounded" />
                </td>

                <td className="p-2 border">
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </td>

                <td className="p-2 border">
                  <div className="flex justify-center gap-2">
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
              <tr key={banner._id}>
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">
                  {banner.image ? (
                    <img
                      src={banner.image}
                      className="w-16 h-10 object-cover rounded"
                    />
                  ) : "—"}
                </td>
                <td className="p-2 border">{banner.title}</td>
                <td className="p-2 border truncate max-w-[250px]">
                  {banner.paragraph}
                </td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${banner.isActive
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
                      title="View"
                      onClick={() => handleView(banner)}
                      className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      <FaEye />
                    </button>

                    <button className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200">
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteBannerById(banner._id)}
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

      {/* VIEW MODAL */}
      {selectedBanner && (
        <ViewBannerModal
          banner={selectedBanner}
          onClose={() => setSelectedBanner(null)}
        />
      )}
    </div>
  );
}
