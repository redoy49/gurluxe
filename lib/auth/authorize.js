import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/mongoDb";
import { getSession } from "./session";

// Single source of truth for "what role does a brand-new account get".
// An email listed in ADMIN_EMAILS (server-only env var, never sent to the
// client) becomes an admin at signup time; everyone else is a regular user.
export function resolveInitialRole(email) {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.toLowerCase()) ? "admin" : "user";
}

function toPublicUser(user) {
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role || "user",
    avatar: user.avatar || null,
    provider: user.provider || "credentials",
  };
}

// Re-reads the user's role straight from the database instead of trusting
// the signed session cookie for it, so authorization checks always see the
// current role rather than whatever role was true when the cookie was
// issued (a session can live for days).
export async function getFreshUser() {
  const session = await getSession();

  if (!session?.id || !ObjectId.isValid(session.id)) return null;

  const db = await dbConnect();
  const user = await db.collection("users").findOne(
    { _id: new ObjectId(session.id) },
    { projection: { password: 0 } },
  );

  return toPublicUser(user);
}

// For Server Components (pages/layouts): redirects rather than rendering.
export async function requireAdminPage() {
  const user = await getFreshUser();

  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  return user;
}

// For customer-facing account pages (profile/orders/wishlist): any signed-in
// user, admins included, no role check. Re-reads from the database for the
// same reason requireAdminPage does — a stale cookie shouldn't be trusted.
export async function requireUserPage() {
  const user = await getFreshUser();

  if (!user) redirect("/login");

  return user;
}

// For Server Actions: actions can't redirect the caller like a page can, so
// this returns a plain result the action turns into its usual
// { success: false, message } response instead.
export async function requireAdminAction() {
  const user = await getFreshUser();

  if (!user || user.role !== "admin") {
    return { authorized: false, user: null };
  }

  return { authorized: true, user };
}

// Same as requireAdminAction, but for account actions any signed-in user
// (not just admins) is allowed to run — e.g. updating a profile or wishlist.
export async function requireUserAction() {
  const user = await getFreshUser();

  if (!user) {
    return { authorized: false, user: null };
  }

  return { authorized: true, user };
}
