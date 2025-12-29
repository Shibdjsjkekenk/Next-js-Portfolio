"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { GrUnorderedList } from "react-icons/gr";
import { toast } from "react-toastify";
import logo from "@/assets/logo-white.png";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import useLogout from "@/hooks/useLogout";
import Sidebar from "@/components/admin-view/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const logout = useLogout();

  const { user, loading } = useSelector((state: RootState) => state.user);

  /* ADMIN GUARD */
  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "ADMIN") {
      window.location.replace("/login");
    }
  }, [user, loading]);

  /* LOGIN TOAST */
  useEffect(() => {
    const msg = localStorage.getItem("loginToast");
    if (msg) {
      toast.success(msg);
      localStorage.removeItem("loginToast");
    }
  }, []);

  /* LOGOUT (AS IT IS) */
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
                window.location.href = "/login?reason=logout";
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* MOBILE TOP BAR */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#04728f] text-white flex items-center gap-3 px-4 z-50 shadow">
        <button
          onClick={() => setIsMobileOpen((p) => !p)}
          className="p-2 rounded bg-white/20"
        >
          <GrUnorderedList />
        </button>
        <Image src={logo} alt="logo" className="w-28 h-8 object-contain" />
      </header>

      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <div className="flex pt-14 md:pt-0">
        <Sidebar
          user={user}
          isOpen={isOpen}
          isMobileOpen={isMobileOpen}
          setIsOpen={setIsOpen}
          setIsMobileOpen={setIsMobileOpen}
          onLogout={handleLogout}
        />

        {/* RIGHT SIDE CONTENT */}
        <main className="flex-1 px-4 py-3 bg-[#f9f9010f]">{children}</main>
      </div>
    </div>
  );
}
