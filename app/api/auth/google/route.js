import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GOOGLE_OAUTH_STATE_COOKIE = "google_oauth_state";
export const GOOGLE_OAUTH_FROM_COOKIE = "google_oauth_from";

// GET /api/auth/google — starts the OAuth flow by sending the browser to
// Google's consent screen. Kicked off from a plain link in Login/Register
// so it works as a full top-level navigation (required for OAuth redirects).
export async function GET(request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "google_not_configured");
    return NextResponse.redirect(url);
  }

  const { searchParams, origin } = new URL(request.url);
  const from = searchParams.get("from");
  const state = crypto.randomUUID();
  const redirectUri = `${origin}/api/auth/google/callback`;

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("access_type", "online");
  authUrl.searchParams.set("prompt", "select_account");

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 5, // 5 minutes — only needs to survive the round trip to Google
    path: "/",
  };

  cookieStore.set(GOOGLE_OAUTH_STATE_COOKIE, state, cookieOptions);

  // Only follow internal paths on return, to avoid an open redirect.
  if (from && from.startsWith("/") && !from.startsWith("//")) {
    cookieStore.set(GOOGLE_OAUTH_FROM_COOKIE, from, cookieOptions);
  } else {
    cookieStore.delete(GOOGLE_OAUTH_FROM_COOKIE);
  }

  return NextResponse.redirect(authUrl);
}
