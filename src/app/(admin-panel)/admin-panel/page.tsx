"use client";

import { useState, useEffect } from "react";
import {
  MdOutlineDashboardCustomize,
  MdOutlineDashboard,
  MdContactMail,
} from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { FaUsersCog, FaProjectDiagram } from "react-icons/fa";
import { GoProjectRoadmap } from "react-icons/go";
import { BsInfoCircle } from "react-icons/bs";
import { RiTimelineView } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { GrUnorderedList } from "react-icons/gr";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import logo from "@/assets/logo-white.png";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import ROLE from "@/common/role";
import useLogout from "@/hooks/useLogout";
import Marquee from "react-fast-marquee";

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const logout = useLogout();

  const { user, loading } = useSelector((state: RootState) => state.user);

  /*  ADMIN GUARD */
  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== ROLE.ADMIN) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  /*  LOGOUT */
  const handleLogout = () => {
    toast.info(
      <div>
        <p className="font-medium mb-2">Are you sure you want to logout?</p>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
            onClick={async () => {
              try {
                await logout();
                toast.dismiss();
                toast.success("Logged out successfully");
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
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Checking permissions...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`bg-[#04728f] min-h-screen flex flex-col transition-all duration-300 customShadow ${isOpen ? "w-60" : "w-16"
          }`}
      >
        {/* ===== TOP BAR ===== */}
        <div className="h-14 px-3 flex items-center gap-3 border-b border-white/30">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded hover:bg-white/20 text-white"
          >
            <GrUnorderedList />
          </button>

          {isOpen && (
            <Link href="/">
              <Image src={logo} alt="logo" className="w-32 h-10 object-contain" />
            </Link>
          )}
        </div>

        {/* ===== PROFILE ===== */}
        <div className="py-4 px-3 flex items-center gap-3 border-b border-white/30">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-white"
            />
          ) : (
            <FaRegCircleUser className="text-4xl text-white" />
          )}

          {isOpen && (
            <div className="leading-tight text-white">
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm opacity-80 flex items-center gap-1">
                <MdAdminPanelSettings /> ({user.role})
              </p>
            </div>
          )}
        </div>

        {/* ===== MENU ===== */}
        <nav className="flex-1 p-3 grid text-sm">
          <MenuItem icon={<MdOutlineDashboardCustomize />} label="Dashboard" isOpen={isOpen} />
          <MenuItem icon={<FaUsersCog />} label="All Users" isOpen={isOpen} />
          <MenuItem icon={<GoProjectRoadmap />} label="Exp. Project" isOpen={isOpen} />
          <MenuItem icon={<FaProjectDiagram />} label="Relevant Project" isOpen={isOpen} />
          <MenuItem icon={<BsInfoCircle />} label="About Us" isOpen={isOpen} />
          <MenuItem icon={<MdOutlineDashboard />} label="Banner" isOpen={isOpen} />
          <MenuItem icon={<RiTimelineView />} label="Timeline" isOpen={isOpen} />
          <MenuItem icon={<MdContactMail />} label="Contact Data" isOpen={isOpen} />
        </nav>

        {/* ===== LOGOUT ===== */}
        <div className="px-3 pb-2">
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-white text-[16px] hover:bg-red-500 cursor-pointer"
          >
            <span className="text-lg">⏻</span>
            {isOpen && <span className="font-medium">Logout</span>}
          </div>
        </div>

        {/* ===== COPYRIGHT (SCROLLING TEXT) ===== */}
        <div className="border-t border-white/30 py-2">
          <Marquee
            speed={40}
            gradient={false}
            pauseOnHover
            className="text-xs text-white opacity-80"
          >
            <span className="mr-16">
              Copyright © 2025, Tiwari&apos;s, All Rights Reserved.
            </span>
            <span className="mr-16">
              Copyright © 2025, Tiwari&apos;s, All Rights Reserved.
            </span>
          </Marquee>
        </div>



      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-4">
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

/* ---------- MENU ITEM ---------- */
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
    <div className="flex items-center gap-3 px-3 py-2 rounded-[10px] cursor-pointer text-white text-[16px] hover:bg-[#5BB3CB] transition">
      <span className="text-[18px]">{icon}</span>
      {isOpen && <span className="font-medium">{label}</span>}
    </div>
  );
}
