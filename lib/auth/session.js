import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  encryptSession,
  decryptSession,
} from "./crypto";

// Server Components / Server Actions only (uses next/headers cookies()).
// The proxy should import the pure helpers from "./crypto" directly instead.

export async function createSession(user) {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const token = await encryptSession({ ...user, exp: expiresAt });

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  return decryptSession(token);
}

// Cheap, cookie-only read for display purposes (Navbar, etc). This trusts
// the signed cookie's role/avatar for rendering, but nothing here should be
// used to gate access — actual authorization checks re-read the role from
// the database via lib/auth/authorize.js so a stale cookie can't grant
// privileges it no longer should.
export async function getCurrentUser() {
  const session = await getSession();

  if (!session) return null;

  return {
    id: session.id,
    name: session.name,
    email: session.email,
    role: session.role || "user",
    avatar: session.avatar || null,
    provider: session.provider || "credentials",
  };
}
