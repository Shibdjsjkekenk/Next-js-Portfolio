"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

const ITEMS_PER_PAGE = 5;

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/admin/all-users");
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = users.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  if (loading) {
    return <p className="text-center">Loading users...</p>;
  }

  return (
    <div className="space-y-6">

      {/* ================= PAGE HEADER ================= */}
      <div className="bg-white rounded-xl p-4 shadow">
        <h1 className="text-2xl font-bold text-gray-800">
          All Users <span className="text-sm text-gray-500 ">( Manage all registered users here)</span>
        </h1>

      </div>

      {/* ================= TABLE SECTION ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden mb-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">

            {/* TABLE HEADER */}
            <thead className="bg-[#6A38C2] text-white">
              <tr>
                <th className="p-3 border border-purple-500 text-left">Sr.</th>
                <th className="p-3 border border-purple-500 text-left">Name</th>
                <th className="p-3 border border-purple-500 text-left">Email</th>
                <th className="p-3 border border-purple-500 text-left">Role</th>
                <th className="p-3 border border-purple-500 text-left">
                  Created Date
                </th>
                <th className="p-3 border border-purple-500 text-center">
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="p-3 border text-sm">
                    {startIndex + index + 1}
                  </td>

                  <td className="p-3 border font-medium">
                    {user.name}
                  </td>

                  <td className="p-3 border">
                    {user.email}
                  </td>

                  <td className="p-3 border">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold
                      bg-blue-100 text-blue-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-3 border">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="p-3 border">
                    <div className="flex justify-center gap-3">
                      <button
                        className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                        title="Edit User"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                        title="Delete User"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-gray-500 border"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          {/* PREV */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="
      px-2 py-1 rounded-md
      border border-gray-300
      bg-white text-gray-700
      hover:bg-gray-100 hover:border-gray-400
      disabled:opacity-40 disabled:cursor-not-allowed
      transition
    "
          >
            Prev
          </button>

          {/* PAGE NUMBERS */}
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            const isActive = currentPage === page;

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`
          px-3 py-1 rounded-md font-medium
          border transition
          ${isActive
                    ? "bg-[#6A38C2] text-white border-[#6A38C2]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  }
        `}
              >
                {page}
              </button>
            );
          })}

          {/* NEXT */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="
      px-2 py-1 rounded-md
      border border-gray-300
      bg-white text-gray-700
      hover:bg-gray-100 hover:border-gray-400
      disabled:opacity-40 disabled:cursor-not-allowed
      transition
    "
          >
            Next
          </button>
        </div>

      )}
    </div>
  );
}
