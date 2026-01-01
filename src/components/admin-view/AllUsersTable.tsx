"use client";

import { FaEdit, FaTrash } from "react-icons/fa";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type AllUsersTableProps = {
  users: User[];
  loading: boolean;
  fetchedOnce: boolean;
  startIndex: number;
};

export default function AllUsersTable({
  users,
  loading,
  fetchedOnce,
  startIndex,
}: AllUsersTableProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="overflow-x-auto">

      {/* 🔥 TABLE-ONLY LOADING */}
      {loading && !fetchedOnce ? (
        <div className="p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      ) : (
        <table className="w-full border-collapse">

          {/* TABLE HEADER */}
          <thead className="bg-[#6A38C2] text-white">
            <tr>
              <th className="p-2 border text-left whitespace-nowrap">Sr.</th>
              <th className="p-2 border text-left whitespace-nowrap">Name</th>
              <th className="p-2 border text-left whitespace-nowrap">Email</th>
              <th className="p-2 border text-left whitespace-nowrap">Role</th>
              <th className="p-2 border text-left whitespace-nowrap">Created Date</th>
              <th className="p-2 border text-center">Action</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 whitespace-nowrap transition"
              >
                <td className="p-2 border text-sm">
                  {startIndex + index + 1}
                </td>

                <td className="p-2 border font-medium">
                  {user.name}
                </td>

                <td className="p-2 border">
                  {user.email}
                </td>

                <td className="p-2 border">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {user.role}
                  </span>
                </td>

                <td className="p-2 border">
                  {formatDate(user.createdAt)}
                </td>

                <td className="p-2 border">
                  <div className="flex justify-center gap-2">
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

            {users.length === 0 && (
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
      )}
    </div>
  );
}
