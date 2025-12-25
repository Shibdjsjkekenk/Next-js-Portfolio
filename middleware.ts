import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import ROLE from "@/common/role";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  /* -------------------- API ROUTES -------------------- */
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  /* -------------------- PUBLIC ROUTES -------------------- */
  const publicRoutes = [
    "/login",
    "/sign-up",
    "/forgot-password",
  ];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  /* -------------------- ADMIN PANEL (STRICT) -------------------- */
  if (pathname === "/admin-panel" || pathname.startsWith("/admin-panel/")) {
    // ❌ Not logged in OR not admin → login
    if (!token || role !== ROLE.ADMIN) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  /* -------------------- OTHER PROTECTED ROUTES -------------------- */
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

/* -------------------- MATCHER -------------------- */
export const config = {
  matcher: [
    "/admin-panel",
    "/admin-panel/:path*",
    "/profile/:path*",
    "/", // optional: home protection if needed
  ],
};
