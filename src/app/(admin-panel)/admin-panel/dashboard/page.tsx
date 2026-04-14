"use client";

import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Users, ShieldCheck, User, FolderKanban } from "lucide-react";
import type { RootState } from "@/store/store";
import { setAllUsers, setAllUsersLoading } from "@/store/allUsersSlice";
import SummaryApi from "@/common/SummaryApi";
import api from "@/lib/axios";
import { FaUsers } from "react-icons/fa";
import { useProjects } from "@/hooks/useProjects";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as PieTooltip,
  Legend as PieLegend,
} from "recharts";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
import { Bot, Sparkles, X } from "lucide-react";
import { useState } from "react";
import AdminAiModal from "@/components/admin-view/AdminAiModal";

const UserMap = dynamic(() => import("@/components/admin-view/UserMap"), {
  ssr: false,
});

export default function AdminDashboardPage() {
  const [openAI, setOpenAI] = useState(false);
  const dispatch = useDispatch();

  const { list, loading, fetchedOnce } = useSelector(
    (state: RootState) => state.allUsers
  );

  const { list: projects, getAllProjects } = useProjects();

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    if (fetchedOnce) return;

    const fetchUsers = async () => {
      try {
        dispatch(setAllUsersLoading());

        const res = await api({
          url: SummaryApi.all_users.url,
          method: SummaryApi.all_users.method,
          withCredentials: true,
        });

        if (res.data?.success) {
          dispatch(setAllUsers(res.data.data));
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchUsers();
  }, [dispatch, fetchedOnce]);

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    getAllProjects();
  }, []);

  /* ================= USER STATS ================= */
  const userStats = useMemo(() => {
    const total = list.length;
    const admin = list.filter((u) => u.role === "ADMIN").length;
    const general = list.filter((u) => u.role === "GENERAL").length;

    const adminLogins = list
      .filter((u: any) => u.role === "ADMIN")
      .reduce((sum: number, u: any) => sum + (u.loginCount || 0), 0);

    const generalLogins = list
      .filter((u: any) => u.role === "GENERAL")
      .reduce((sum: number, u: any) => sum + (u.loginCount || 0), 0);

    return { total, admin, general, adminLogins, generalLogins };
  }, [list]);

  /* ================= PROJECT STATS ================= */
  const projectStats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p: any) => p.isActive).length;
    const inactive = projects.filter((p: any) => !p.isActive).length;
    return { total, active, inactive };
  }, [projects]);

  /* ===== LAST LOGIN HELPER ===== */
  const getLastLogin = (user: any) => {
    if (!user?.logins?.length) return null;
    return user.logins[user.logins.length - 1];
  };

  const mapUsers = list
    .map((u: any) => {
      const last = getLastLogin(u);
      return {
        name: u.name || u.email,
        lat: last?.latitude,
        lon: last?.longitude,
        city: last?.city,
        state: last?.state,
        country: last?.country,
      };
    })
    .filter((u) => u.lat && u.lon);

  /* ================= PER USER LOGIN CHART ================= */
  const loginChart = {
    labels: list.map((u: any) => u.name || u.email),
    datasets: [
      {
        label: "Login Count",
        data: list.map((u: any) => u.loginCount || 0),
        backgroundColor: list.map((u: any) =>
          u.role === "ADMIN" ? "#fbbf24" : "#4ade80"
        ),
        borderRadius: 8,
      },
    ],
  };

  /* PROJECT PIE DATA */
  const projectPie = [
    { name: "Active", value: projectStats.active },
    { name: "Inactive", value: projectStats.inactive },
  ];

  const PIE_COLORS = ["#22c55e", "#ef4444"];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (ctx: any) => {
            const user = list[ctx[0].dataIndex];
            return user.name || user.email;
          },
          label: (ctx: any) => {
            const user = list[ctx.dataIndex];
            const last = getLastLogin(user);

            return [
              `Logins: ${user.loginCount || 0}`,
              `Device: ${last?.deviceName || "Unknown"}`,
              `IP: ${last?.ipAddress || "Unknown"}`,
              `Location: ${last?.city || ""}, ${last?.state || ""}, ${last?.country || ""}`,
            ];
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  /* ================= SKELETON ================= */
  if (loading && list.length === 0) {
    return (
      <div className="p-6 animate-pulse space-y-6">
        <div className="h-10 w-64 bg-gray-200 rounded-xl" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-36 bg-gray-200 rounded-2xl" />
          <div className="h-36 bg-gray-200 rounded-2xl" />
          <div className="h-36 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-xl py-3 px-5 shadow flex items-center justify-between">
          <h1 className="font-bold text-gray-800 flex items-center gap-2 text-base sm:text-2xl">
            <FaUsers className="text-[#6A38C2]" />
            Admin Dashboard
          </h1>

          {/* AI BUTTON */}
          <button
            onClick={() => setOpenAI(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow hover:scale-105 transition"
          >
            <Sparkles size={16} />
            Ask with AI
          </button>
        </div>

        {/* USERS */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard title="Total Users" value={userStats.total} icon={<Users size={20} />} color="indigo" />
          <StatCard title="Admins" value={userStats.admin} icon={<ShieldCheck size={20} />} color="emerald" />
          <StatCard title="General Users" value={userStats.general} icon={<User size={20} />} color="orange" />
        </div>

        {/* PROJECTS */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard title="Total Projects" value={projectStats.total} icon={<FolderKanban size={20} />} color="indigo" type="project" />
          <StatCard title="Active Projects" value={projectStats.active} icon={<FolderKanban size={20} />} color="emerald" type="project" />
          <StatCard title="Inactive Projects" value={projectStats.inactive} icon={<FolderKanban size={20} />} color="orange" type="project" />
        </div>

        {/* PROFESSIONAL CHARTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

          {/* USER LOGIN CHART */}
          <div className="bg-white rounded-2xl shadow p-4 sm:p-5 md:col-span-3">
            <h2 className="font-semibold mb-4 text-gray-700">
              User Login Analytics
            </h2>

            {/* SCROLL WRAPPER */}
            <div className="w-full">
              <div className="relative w-full">

                {/* ONLY horizontal scroll on mobile */}
                <div className="overflow-x-auto overflow-y-hidden">
                  <div className="min-w-[600px] md:min-w-full">

                    {/* RESPONSIVE HEIGHT */}
                    <div className="h-[340px] md:h-[300px]">
                      <Bar data={loginChart} options={chartOptions} />
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* PROJECT PIE */}
          <div className="bg-white rounded-2xl shadow p-4 sm:p-5 md:col-span-1">
            <h2 className="font-semibold mb-3 sm:mb-4 text-gray-700 text-sm sm:text-base">
              Project Activity
            </h2>

            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={projectPie}
                  dataKey="value"
                  outerRadius={80} // mobile friendly
                  label
                >
                  {projectPie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <PieTooltip />
                <PieLegend />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
        {/*  USER LOGIN TABLE (NEW) */}
        <div className="bg-white rounded-2xl shadow p-5 mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            User Last Login Info
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Device</th>
                  <th className="p-3">IP</th>
                  <th className="p-3">City</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Logins</th>
                </tr>
              </thead>

              <tbody>
                {list.map((user: any, i: number) => {
                  const last = getLastLogin(user);

                  return (
                    <tr key={i} className="border-t hover:bg-gray-50 transition">
                      <td className="p-3 font-medium">
                        {user.name || user.email}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${user.role === "ADMIN"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                            }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="p-3">{last?.deviceName || "—"}</td>
                      <td className="p-3">{last?.ipAddress || "—"}</td>
                      <td className="p-3">{last?.city || "—"}</td>
                      <td className="p-3">{last?.state || "—"}</td>
                      <td className="p-3">{last?.country || "—"}</td>
                      <td className="p-3 font-semibold">
                        {user.loginCount || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* USER LOCATION MAP */}
          <div className="bg-white rounded-2xl shadow p-5 mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              User Location Map
            </h2>

            <div className="h-[420px] w-full rounded-xl overflow-hidden border">
              <UserMap users={mapUsers} />
            </div>
          </div>
        </div>
      </div>

      <AdminAiModal open={openAI} onClose={() => setOpenAI(false)} />
    </>
  );
}

/* CARD UNTOUCHED */
type CardColor = "indigo" | "emerald" | "orange";

function StatCard({
  title,
  value,
  icon,
  color,
  type = "user",
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: CardColor;
  type?: "user" | "project";
}) {
  const userColors = {
    indigo: "from-indigo-500 to-purple-500",
    emerald: "from-emerald-500 to-teal-500",
    orange: "from-amber-500 to-orange-500",
  };

  const projectColors = {
    indigo: "from-violet-500 to-fuchsia-500",
    emerald: "from-cyan-500 to-blue-500",
    orange: "from-rose-500 to-pink-500",
  };

  const gradient = type === "project" ? projectColors[color] : userColors[color];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${gradient} text-white shadow-lg`}>
      <div className="py-3 px-4 flex items-center justify-between">
        <div>
          <p className="text-white text-xl font-bold">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}