"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/axios";
import SummaryApi from "@/common/SummaryApi";
import { toast } from "react-toastify";
import AllUsersTable from "@/components/admin-view/AllUsersTable";
import {
  setAllUsers,
  setAllUsersLoading,
} from "@/store/allUsersSlice";
import type { RootState, AppDispatch } from "@/store/store";
import Pagination from "@/components/admin-view/Pagination";
import { FaUsers } from "react-icons/fa";


const ITEMS_PER_PAGE = 5;

export default function AllUsersPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { list: users, loading, fetchedOnce } = useSelector(
    (state: RootState) => state.allUsers
  );

  const [currentPage, setCurrentPage] = useState(1);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    if (!fetchedOnce) {
      dispatch(setAllUsersLoading());

      api({
        url: SummaryApi.all_users.url,
        method: SummaryApi.all_users.method,
      })
        .then((res) => {
          if (res.data?.success) {
            dispatch(setAllUsers(res.data.data));
          } else {
            dispatch(setAllUsers([]));
          }
        })
        .catch((err: any) => {
          toast.error(
            err.response?.data?.message || "Failed to fetch users"
          );
          dispatch(setAllUsers([]));
        });
    }
  }, [dispatch, fetchedOnce]);

  // Pagination
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = users.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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
          <FaUsers className="text-[#6A38C2] text-sm sm:text-xl shrink-0" />

          {/* TITLE */}
          <span>All Users</span>

          {/* SUB TEXT */}
          <span
            className="
      text-xs sm:text-sm
      text-gray-500
      truncate
      max-w-[180px] sm:max-w-none
    "
          >
            ( Manage all registered users here )
          </span>
        </h1>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <AllUsersTable
          users={currentUsers}
          loading={loading}
          fetchedOnce={fetchedOnce}
          startIndex={startIndex}
        />
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
