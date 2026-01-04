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
import ChangeUserRoleModal from "@/components/admin-view/ChangeUserRoleModal";
import { removeAllUser } from "@/store/allUsersSlice";

const ITEMS_PER_PAGE = 5;

export default function AllUsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { list: users, loading, fetchedOnce } = useSelector(
    (state: RootState) => state.allUsers
  );

  const [currentPage, setCurrentPage] = useState(1);

  const handleDeleteUser = (userId: string) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="text-sm font-medium mb-3">
            Are you sure you want to delete this user?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => closeToast()}
              className="px-3 py-1 text-sm rounded-md border bg-white hover:bg-gray-100"
            >
              No
            </button>

            <button
              onClick={async () => {
                try {
                  const res = await api({
                    url: SummaryApi.delete_user.url,
                    method: SummaryApi.delete_user.method,
                    data: { userId },
                    withCredentials: true,
                  });

                  if (res.data?.success) {
                    dispatch(removeAllUser(userId));
                    toast.success("User deleted successfully");
                  }
                } catch (err: any) {
                  toast.error(
                    err.response?.data?.message || "Failed to delete user"
                  );
                } finally {
                  closeToast();
                }
              }}
              className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      ),
      {
        closeOnClick: false,
        autoClose: false,
      }
    );
  };

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
          onEdit={(user) => setSelectedUser(user)}
          onDelete={handleDeleteUser}
        />

        {selectedUser && (
          <ChangeUserRoleModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}


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
