"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import api from "@/lib/axios";
import SummaryApi from "@/common/SummaryApi";
import { toast } from "react-toastify";
import Table from "@/common/Table";
import {
    setBanners,
    setBannersLoading,
} from "@/store/bannerSlice";
import type { RootState, AppDispatch } from "@/store/store";

export default function BannerPage() {
    const dispatch = useDispatch<AppDispatch>();

    const { list: banners, loading, fetchedOnce } = useSelector(
        (state: RootState) => state.banner
    );

    /* ================= FETCH BANNERS ================= */
    useEffect(() => {
        if (!fetchedOnce) {
            dispatch(setBannersLoading());

            api({
                url: SummaryApi.get_all_banners.url,
                method: SummaryApi.get_all_banners.method,
            })
                .then((res) => {
                    if (res.data?.success) {
                        dispatch(setBanners(res.data.data));
                    } else {
                        dispatch(setBanners([]));
                    }
                })
                .catch(() => {
                    toast.error("Failed to fetch banners");
                    dispatch(setBanners([]));
                });
        }
    }, [dispatch, fetchedOnce]);

    return (
        <div className="space-y-4">

            {/* PAGE HEADER */}


            <div className="bg-white rounded-xl py-3 px-5 shadow">
                <h1
                    className="
      font-bold text-gray-800
      flex items-center gap-2
      whitespace-nowrap
      text-base sm:text-2xl
    "
                >
                    {/* ICON */}
                    <FaImage className="text-[#6A38C2] text-sm sm:text-xl shrink-0" />

                    {/* TITLE */}
                    <span>Banners</span>

                    {/* SUB TEXT */}
                    <span
                        className="
        text-xs sm:text-sm
        text-gray-500
        truncate
        max-w-[200px] sm:max-w-none
      "
                    >
                        ( Manage website banners )
                    </span>
                </h1>
            </div>


            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-hidden">

                {/* TABLE LOADING */}
                {loading && !fetchedOnce ? (
                    <div className="p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                        <div className="h-40 bg-gray-200 rounded" />
                    </div>
                ) : (
                    <Table
                        headers={[
                            "No",
                            "Image",
                            "Title",
                            "Paragraph",
                            "Status",
                            "Action",
                        ]}
                    >
                        {banners.map((banner, index) => (
                            <tr
                                key={banner._id}
                                className="hover:bg-gray-50 transition"
                            >
                                {/* NO */}
                                <td className="p-2 whitespace-nowrap border">
                                    {index + 1}
                                </td>

                                {/* IMAGE */}
                                <td className="p-2 whitespace-nowrap border">
                                    {banner.image ? (
                                        <img
                                            src={banner.image}
                                            alt="Banner"
                                            className="w-16 h-10 object-cover rounded-md border"
                                        />
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>

                                {/* TITLE */}
                                <td className="p-2 whitespace-nowrap border font-medium">
                                    {banner.title}
                                </td>

                                {/* PARAGRAPH */}
                                <td className="p-2 whitespace-nowrap border max-w-[300px] truncate">
                                    {banner.paragraph}
                                </td>

                                {/* STATUS */}
                                <td className="p-2 whitespace-nowrap border">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${banner.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {banner.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                {/* ACTION */}
                                <td className="p-2 whitespace-nowrap border">
                                    <div className="flex items-center gap-2 justify-center">
                                        <button
                                            title="View"
                                            className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                                        >
                                            <FaEye size={14} />
                                        </button>

                                        <button
                                            title="Edit"
                                            className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                                        >
                                            <FaEdit size={14} />
                                        </button>

                                        <button
                                            title="Delete"
                                            className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {banners.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-4 text-center text-gray-500 border"
                                >
                                    No banners found
                                </td>
                            </tr>
                        )}
                    </Table>
                )}
            </div>
        </div>
    );
}
