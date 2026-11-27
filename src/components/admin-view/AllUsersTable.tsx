"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import Table from "@/common/Table";

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

  // 🔥 Loading handled HERE (feature-level)
  if (loading && !fetchedOnce) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-40 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <Table
      headers={[
        "Sr.",
        "Name",
        "Email",
        "Role",
        "Created Date",
        "Action",
      ]}
    >
      {users.map((user, index) => (
        <tr
          key={user._id}
          className="hover:bg-gray-50 whitespace-nowrap transition"
        >
          <td className="p-2 border">
            {startIndex + index + 1}
          </td>

          <td className="p-2 border font-medium">
            {user.name}
          </td>

          <td className="p-2 border">
            {user.email}
          </td>

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
    </Table>
  );
}
