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
  const publicRoutes = ["/login", "/sign-up", "/forgot-password"];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      if (role === ROLE.ADMIN) {
        return NextResponse.redirect(
          new URL("/admin-panel", request.url)
        );
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  /* -------------------- ADMIN PANEL (STRICT) -------------------- */
  if (pathname.startsWith("/admin-panel")) {
    if (!token || role !== ROLE.ADMIN) {
      const loginUrl = new URL("/login", request.url);

      // 🔥 PASS REASON FOR TOAST
      loginUrl.searchParams.set("reason", "unauthorized");

      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  /* -------------------- OTHER PROTECTED ROUTES -------------------- */
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("reason", "unauthorized");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/* -------------------- MATCHER -------------------- */
export const config = {
  matcher: [
    "/admin-panel/:path*",
    "/profile/:path*",
  ],
};
