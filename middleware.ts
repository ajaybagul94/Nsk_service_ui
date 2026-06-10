import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/customer", "/provider"];

const ROLE_ROUTES: Record<string, string> = {
  ADMIN: "/admin",
  CUSTOMER: "/customer",
  PLUMBER: "/provider",
  ELECTRICIAN: "/provider",
  GARAGE: "/provider",
  PEST_CONTROL: "/provider",
  WASHER: "/provider",
};

function decodeRole(token: string | undefined): string | null {
  if (!token) {
    return null;
  }
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="));
    const data = JSON.parse(json) as { role?: string; exp?: number };
    if (!data.role || !data.exp || Date.now() >= data.exp * 1000) {
      return null;
    }
    return data.role;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get("nashik_access_token")?.value;
  const role = decodeRole(token);

  if (!role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowedPath = ROLE_ROUTES[role];
  if (allowedPath && !pathname.startsWith(allowedPath)) {
    return NextResponse.redirect(new URL(allowedPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*", "/provider/:path*"],
};
