import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

const PROTECTED = ["/dashboard", "/events"];
const AUTH_PAGES = ["/login", "/signup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("session")?.value;
  const session = token ? await verifySession(token) : null;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname === p);

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/events/:path*", "/login", "/signup"],
};
