"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import SummaryApi from "@/common/SummaryApi";
import loginIcons from "@/assets/signin.gif";
import ROLE from "@/common/role";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api({
        url: SummaryApi.signIn.url,
        method: SummaryApi.signIn.method,
        data: {
          email,
          password,
        },
      });

      if (response.data?.success) {
        const role = response.data?.user?.role;

        if (role === ROLE.ADMIN) {
          router.push("/admin-panel");
        } else {
          router.push("/");
        }
      }

    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="login">
      <div className="container mx-auto p-4">

        <div className="bg-slate-100 p-5 w-full max-w-sm mx-auto mt-20 mb-16 rounded-xl login-shadow">

          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-4">
            <Image
              src={loginIcons}
              alt="login icon"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="pt-6 flex flex-col gap-4"
          >

            {/* Email */}
            <div>
              <label className="font-medium">Email :</label>
              <div className="bg-white mt-2 p-2 rounded-[11px]">
                <input
                  type="email"
                  placeholder="Enter email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-medium">Password :</label>
              <div className="bg-white mt-2 p-2 flex items-center rounded-[11px]">
                <input
                  type="password"
                  placeholder="Enter password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none"
                />

                {/* UI same rakha – functionality baad me add kar sakte ho */}
                <span className="text-xl text-gray-600 cursor-pointer">
                  <FaEye />
                </span>
              </div>

              <Link
                href="/forgot-password"
                className="block w-fit ml-auto mt-2 text-sm hover:underline hover:text-red-600"
              >
                Forgot password ?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            {/* Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="text-[18px] p-2 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-transform transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-[#6A38C2] disabled:pointer-events-none disabled:opacity-50 text-white px-4 py-2 rounded-full bg-[#6A38C2] w-full max-w-[150px] shadow-[0px_4px_8px_rgba(0,0,0,0.3),inset_0px_-2px_4px_rgba(255,255,255,0.3)] hover:shadow-[0px_6px_12px_rgba(0,0,0,0.4),inset_0px_-4px_6px_rgba(255,255,255,0.4)] h-[40px]"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

          </form>

          {/* Footer */}
          <p className="my-5 text-center text-sm">
            Don&apos;t have an account ?{" "}
            <Link
              href="/sign-up"
              className="text-red-600 hover:text-red-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}
