"use client";

import { useState, useEffect } from "react";
import {
  MdOutlineDashboardCustomize,
  MdOutlineDashboard,
  MdContactMail,
} from "react-icons/md";
import { FaUsersCog, FaProjectDiagram } from "react-icons/fa";
import { GoProjectRoadmap } from "react-icons/go";
import { BsInfoCircle } from "react-icons/bs";
import { RiTimelineView } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { GrUnorderedList } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import ROLE from "@/common/role";

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  /* 🔐 MERN-STYLE ADMIN PROTECTION */
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await api.get("/api/auth/me");

        if (res.data?.data?.role !== ROLE.ADMIN) {
          window.location.replace("/login");
          return;
        }

        setCheckingAuth(false);
      } catch {
        window.location.replace("/login");
      }
    };

    checkAdmin();
  }, []);

  /* 🚪 LOGOUT */
  const handleLogout = () => {
    toast.info(
      <div>
        <p className="font-medium mb-2">Are you sure you want to logout?</p>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
            onClick={async () => {
              try {
                await api.post("/api/auth/logout");
                toast.dismiss();
                toast.success("Logged out successfully");
                window.location.replace("/login"); // 🔥 HARD REDIRECT
              } catch {
                toast.dismiss();
                toast.error("Logout failed");
              }
            }}
          >
            Logout
          </button>
          <button
            className="px-3 py-1 bg-gray-300 rounded text-sm"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  /* ⏳ Prevent render until auth check */
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Checking permissions...
      </div>
    );
  }

  return (
      <div className="min-h-screen flex bg-gray-100">

            {/* Sidebar */}
            <aside
                className={`bg-white min-h-full transition-all duration-300 customShadow
        ${isOpen ? "w-60" : "w-16"}`}
            >
                {/* Profile */}
                <div className="h-32 flex flex-col items-center justify-center gap-1">
                    <FaRegCircleUser className="text-5xl" />
                    {isOpen && (
                        <>
                            <p className="text-lg font-semibold flex items-center gap-1">
                                <MdAdminPanelSettings /> Admin
                            </p>
                            <p className="text-sm">(ADMIN)</p>
                        </>
                    )}
                </div>

                {/* Menu */}
                <nav className="p-3 grid gap-2 text-sm">
                    <MenuItem icon={<MdOutlineDashboardCustomize />} label="Dashboard" isOpen={isOpen} />
                    <MenuItem icon={<FaUsersCog />} label="All Users" isOpen={isOpen} />
                    <MenuItem icon={<GoProjectRoadmap />} label="Exp. Project" isOpen={isOpen} />
                    <MenuItem icon={<FaProjectDiagram />} label="Relevant Project" isOpen={isOpen} />
                    <MenuItem icon={<BsInfoCircle />} label="About Us" isOpen={isOpen} />
                    <MenuItem icon={<MdOutlineDashboard />} label="Banner" isOpen={isOpen} />
                    <MenuItem icon={<RiTimelineView />} label="Timeline" isOpen={isOpen} />
                    <MenuItem icon={<MdContactMail />} label="Contact Data" isOpen={isOpen} />
                    {/* Logout – bottom */}
                    <div className="absolute bottom-4 w-full px-3">
                        <div
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                            <span className="text-lg">⏻</span>
                            {isOpen && <span className="font-medium">Logout</span>}
                        </div>
                    </div>

                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4">
                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="mb-4 flex items-center gap-2 bg-[#6A38C2] text-white px-4 py-2 rounded-full"
                >
                    <GrUnorderedList />
                    Toggle Menu
                </button>

                {/* Dashboard Content */}
                <div className="bg-white rounded-xl p-6 shadow">
                    <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">
                        This is a static dashboard layout. Functionality will be added later.
                    </p>
                </div>
            </main>
        </div>
  );
}

/* ---------- Menu Item Component ---------- */
function MenuItem({
  icon,
  label,
  isOpen,
}: {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-[10px] hover:bg-[#f16b5030] cursor-pointer">
      <span className="text-lg">{icon}</span>
      {isOpen && <span className="font-medium">{label}</span>}
    </div>
  );
}
