"use client";

import { FaEdit, FaTrash } from "react-icons/fa";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type Props = {
  users: User[];
  loading: boolean;
  fetchedOnce: boolean;
  startIndex: number;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
};

export default function AllUsersTable({
  users,
  loading,
  fetchedOnce,
  startIndex,
  onEdit,
  onDelete,
}: Props) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="overflow-x-auto">
      {loading && !fetchedOnce ? (
        <div className="p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-[#6A38C2] text-white">
            <tr>
              <th className="p-2 border">Sr.</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Created Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  {startIndex + index + 1}
                </td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    {user.role}
                  </span>
                </td>
                <td className="p-2 border">
                  {formatDate(user.createdAt)}
                </td>
                <td className="p-2 border">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                      title="Edit User"
                    >
                      <FaEdit size={14} />
                    </button>

                    <button
                      onClick={() => onDelete(user._id)}
                      className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                      title="Delete User"
                    >
                      <FaTrash size={14} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
