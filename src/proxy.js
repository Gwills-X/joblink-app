import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { query } from "@/lib/db";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = secretKey ? new TextEncoder().encode(secretKey) : null;

async function verifySessionToken(token) {
  if (!encodedKey) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get("session")?.value;
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isEmployerRoute = pathname.startsWith("/dashboard/employer");
  const isSeekerRoute = pathname.startsWith("/dashboard/seeker");

  if (isDashboardRoute && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (sessionToken) {
    const payload = await verifySessionToken(sessionToken);
    if (!payload || !payload.userId) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!payload.role) {
      try {
        const rows = await query(
          "SELECT role FROM users WHERE id = ? LIMIT 1",
          [payload.userId],
        );
        payload.role = rows?.[0]?.role || "guest";
      } catch (err) {
        console.warn("Proxy failed to resolve user role:", err.message);
        payload.role = "guest";
      }
    }

    // if (isSeekerRoute && payload.role === "employer") {
    //   return NextResponse.redirect(new URL("/dashboard", request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
