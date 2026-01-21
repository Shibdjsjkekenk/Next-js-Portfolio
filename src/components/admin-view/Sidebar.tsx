"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdOutlineDashboardCustomize,
  MdOutlineDashboard,
  MdContactMail,
  MdAdminPanelSettings,
} from "react-icons/md";
import { FaUsersCog, FaProjectDiagram } from "react-icons/fa";
import { GoProjectRoadmap } from "react-icons/go";
import { BsInfoCircle } from "react-icons/bs";
import { RiTimelineView } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
import { GrUnorderedList } from "react-icons/gr";
import { BiLogOut } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import Marquee from "react-fast-marquee";
import logo from "@/assets/logo-white.png";
import type { RootState } from "@/store/store";

/* ================= PROPS ================= */
type SidebarProps = {
  user: RootState["user"]["user"];
  isOpen: boolean;
  isMobileOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onLogout: () => void;
};

export default function Sidebar({
  user,
  isOpen,
  isMobileOpen,
  setIsOpen,
  setIsMobileOpen,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
    bg-[#04728f] flex flex-col customShadow
    fixed md:static z-50 transition-transform duration-300
    left-0
    top-14 md:top-0
    h-[calc(100svh-3.5rem)] md:h-screen
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
    ${isOpen ? "md:w-60" : "md:w-16"}
    w-68
  `}
    >
      {/* ===== TOP BAR (DESKTOP) ===== */}
      <div className="hidden md:flex h-14 px-3 items-center gap-3 border-b border-white/30">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 rounded bg-white/20 text-white"
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
      <div className="py-3 px-3 flex items-center gap-3 border-b border-white/30">
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover border border-white"
          />
        ) : (
          <FaRegCircleUser className="text-4xl text-white" />
        )}

        {isOpen && (
          <div className="leading-tight text-white">
            <p className="text-lg font-semibold">{user?.name}</p>
            <p className="text-sm opacity-80 flex items-center gap-1">
              <MdAdminPanelSettings /> ({user?.role})
            </p>
          </div>
        )}
      </div>

      {/* ===== MENU ===== */}
      <nav
        className="
  flex-1 flex flex-col
  text-sm overflow-y-auto min-h-0
  px-2 py-2 md:p-3
"
      >
        <MenuItem
          icon={<MdOutlineDashboardCustomize />}
          label="Dashboard"
          href="/admin-panel"
          isOpen={isOpen}
          active={pathname === "/admin-panel"}
          onClick={() => setIsMobileOpen(false)}
        />

        <MenuItem
          icon={<FaUsersCog />}
          label="All Users"
          href="/admin-panel/all-users"
          isOpen={isOpen}
          active={pathname.startsWith("/admin-panel/all-users")}
          onClick={() => setIsMobileOpen(false)}
        />

        <MenuItem
          icon={<MdOutlineDashboard />}
          label="Banner"
          href="/admin-panel/banner"
          isOpen={isOpen}
          active={pathname.startsWith("/admin-panel/banner")}
          onClick={() => setIsMobileOpen(false)}
        />

        <MenuItem
          icon={<BsInfoCircle />}
          label="About Us"
          href="/admin-panel/about-us"
          isOpen={isOpen}
          active={pathname.startsWith("/admin-panel/about-us")}
          onClick={() => setIsMobileOpen(false)}
        />

        <MenuItem
          icon={<RiTimelineView />}
          label="Timeline"
          href="/admin-panel/timeline"
          isOpen={isOpen}
          active={pathname.startsWith("/admin-panel/timeline")}
          onClick={() => setIsMobileOpen(false)}
        />

        <MenuItem
          icon={<GoProjectRoadmap />}
          label="Exp. Project"
          href="/admin-panel/exp-project"
          isOpen={isOpen}
          active={pathname.startsWith("/admin-panel/exp-project")}
          onClick={() => setIsMobileOpen(false)}
        />

        <MenuItem
          icon={<FaProjectDiagram />}
          label="Relevant Project"
          href="/admin-panel/relevant-project"
          isOpen={isOpen}
          active={pathname.startsWith("/admin-panel/relevant-project")}
          onClick={() => setIsMobileOpen(false)}
        />

        <MenuItem
          icon={<MdContactMail />}
          label="Contact Data"
          href="/admin-panel/contact-data"
          isOpen={isOpen}
          active={pathname.startsWith("/admin-panel/contact-data")}
          onClick={() => setIsMobileOpen(false)}
        />
      </nav>

      {/* ===== BOTTOM SECTION ===== */}
      <div className="mt-auto">
        {/* LOGOUT */}
        <div className="px-3 pb-3">
          <div
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-[10px]
                 text-white text-[16px] bg-[#5bb3cb] cursor-pointer"
          >
            <BiLogOut size={20} />
            {isOpen && <span className="font-medium">Logout</span>}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-white/30 py-1 md:py-2">
          <Marquee
            speed={35}
            gradient={false}
            className="text-[10px] md:text-xs text-white opacity-80"
          >
            <span className="mr-16">Copyright © 2025, Tiwari&apos;s</span>
            <span className="mr-16">Copyright © 2025, Tiwari&apos;s</span>
          </Marquee>
        </div>
      </div>
    </aside>
  );
}

/* ================= MENU ITEM ================= */
function MenuItem({
  icon,
  label,
  isOpen,
  href,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  href: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
    flex items-center gap-4
    h-10 md:h-11
    mb-[2px] md:mb-1
    px-3
    rounded-md
    text-[16px] md:text-[15px]
    leading-none
    text-white transition
    ${active ? "bg-red-500" : "hover:bg-[#5BB3CB]"}
  `}
    >
      <span className="text-[15px] md:text-[17px] leading-none shrink-0">
        {icon}
      </span>

      {isOpen && <span className="font-medium leading-none">{label}</span>}
    </Link>
  );
}
