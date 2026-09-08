import { NextResponse } from "next/server";
import { SESSION_COOKIE, decryptSession } from "@/lib/auth/crypto";

const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/orders", "/wishlist"];
const AUTH_ROUTES = ["/login", "/register"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decryptSession(token);

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && session) {
    // Just a nicer landing spot — not a security decision, since the
    // dashboard layout (and each account page) re-verifies the session from
    // the database on its own.
    const destination = session.role === "admin" ? "/dashboard" : "/";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
    "/login",
    "/register",
  ],
};
