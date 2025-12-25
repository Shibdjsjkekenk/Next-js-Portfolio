import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  res.cookies.set("token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",            // 🔥 VERY IMPORTANT
  });

  res.cookies.set("role", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",            // 🔥 VERY IMPORTANT
  });

  return res;
}
