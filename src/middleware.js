import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Check for authentication token/cookie (adjust cookie name to match your auth setup)
  const sessionToken =
    request.cookies.get("session") || request.cookies.get("auth_token");

  // Define protected route prefixes
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isEmployerRoute = pathname.startsWith("/dashboard/employer");
  const isSeekerRoute = pathname.startsWith("/dashboard/seeker");

  // 2. If trying to access any dashboard without a session, redirect to login
  if ((isDashboardRoute || isEmployerRoute || isSeekerRoute) && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: ["/dashboard/:path*"],
};
