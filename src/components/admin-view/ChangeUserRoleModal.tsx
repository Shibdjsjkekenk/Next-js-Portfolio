"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
import api from "@/lib/axios";
import SummaryApi from "@/common/SummaryApi";
import { updateAllUser } from "@/store/allUsersSlice";
import { toast } from "react-toastify";
import type { AppDispatch } from "@/store/store";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "GENERAL";
};

type Props = {
  user: User;
  onClose: () => void;
};

export default function ChangeUserRoleModal({ user, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [role, setRole] = useState<User["role"]>(user.role);
  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async () => {
    if (role === user.role) {
      toast.info("Role is already same");
      return;
    }

    try {
      setLoading(true);

      const res = await api({
        url: SummaryApi.update_user_role.url,
        method: SummaryApi.update_user_role.method,
        data: {
          userId: user._id,
          role,
        },
        withCredentials: true,
      });

      if (res.data?.success) {
        dispatch(updateAllUser(res.data.data));
        toast.success("User role updated");
        onClose();
      }

    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to update role"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full m-3 max-w-md p-6 relative shadow-xl">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Change User Role
        </h2>

        <div className="space-y-2 text-md mb-4">
          <p><b>Name :</b> {user.name}</p>
          <p><b>Email :</b> {user.email}</p>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <label className="block text-md font-medium mb-1">
            <b>Role :</b>
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as User["role"])}
            className=" border rounded-md px-3 py-2 outline-none !block"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="GENERAL">GENERAL</option>
          </select>
        </div>

        <button
          onClick={handleUpdateRole}
          disabled={loading}
          className="px-3 bg-red-600 text-white py-2 rounded-full font-medium hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Change Role"}
        </button>
      </div>
    </div>
  );
}
