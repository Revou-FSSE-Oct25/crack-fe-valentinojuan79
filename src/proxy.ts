import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


const PROTECTED_ROUTES = ["/dashboard", "/admin", "/technician", "/profile", "/bookings"];
const GUEST_ONLY_ROUTES = ["/login", "/register"];
const ROLE_ROUTES: Record<string, string[]> = {
  ADMIN: ["/admin"],
  TECHNICIAN: ["/technician"],
  CUSTOMER: ["/dashboard"],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const isAuthenticated = Boolean(token);

  if (isAuthenticated && GUEST_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
    const dest = role === "ADMIN" ? "/admin" : role === "TECHNICIAN" ? "/technician" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (!isAuthenticated && PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && role) {
    for (const [allowedRole, routes] of Object.entries(ROLE_ROUTES)) {
      if (routes.some((r) => pathname.startsWith(r)) && role !== allowedRole) {
        const dest = role === "ADMIN" ? "/admin" : role === "TECHNICIAN" ? "/technician" : "/dashboard";
        return NextResponse.redirect(new URL(dest, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/technician/:path*",
    "/profile/:path*",
    "/bookings/:path*",
    "/login",
    "/register",
  ],
};
