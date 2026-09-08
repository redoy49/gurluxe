import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/mongoDb";
import { createSession } from "@/lib/auth/session";
import { resolveInitialRole } from "@/lib/auth/authorize";
import {
  GOOGLE_OAUTH_STATE_COOKIE,
  GOOGLE_OAUTH_FROM_COOKIE,
} from "../route";

function loginErrorRedirect(request, error) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

// GET /api/auth/google/callback — Google redirects back here with either a
// `code` (consent granted) or an `error` (consent denied / misconfiguration).
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;
  const from = cookieStore.get(GOOGLE_OAUTH_FROM_COOKIE)?.value;

  cookieStore.delete(GOOGLE_OAUTH_STATE_COOKIE);
  cookieStore.delete(GOOGLE_OAUTH_FROM_COOKIE);

  if (oauthError) {
    return loginErrorRedirect(request, "google_denied");
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    return loginErrorRedirect(request, "google_state_mismatch");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return loginErrorRedirect(request, "google_not_configured");
  }

  try {
    const redirectUri = `${origin}/api/auth/google/callback`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      console.error("GOOGLE TOKEN EXCHANGE FAILED:", await tokenRes.text());
      return loginErrorRedirect(request, "google_auth_failed");
    }

    const { access_token: accessToken } = await tokenRes.json();

    const profileRes = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!profileRes.ok) {
      console.error("GOOGLE PROFILE FETCH FAILED:", await profileRes.text());
      return loginErrorRedirect(request, "google_auth_failed");
    }

    const profile = await profileRes.json();

    if (!profile.email || profile.email_verified !== true) {
      return loginErrorRedirect(request, "google_email_unverified");
    }

    const email = profile.email.toLowerCase();
    const db = await dbConnect();
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });

    let userDoc;

    if (existingUser) {
      // Account linking: an existing email/password account signing in with
      // Google keeps its role and password, just gains Google profile info.
      await users.updateOne(
        { _id: existingUser._id },
        {
          $set: {
            googleId: profile.sub,
            avatar: profile.picture || existingUser.avatar || null,
            provider: existingUser.provider || "google",
            updatedAt: new Date(),
          },
        },
      );

      userDoc = { ...existingUser };
    } else {
      const newUser = {
        name: profile.name || email,
        email,
        googleId: profile.sub,
        avatar: profile.picture || null,
        provider: "google",
        role: resolveInitialRole(email),
        createdAt: new Date(),
      };

      const inserted = await users.insertOne(newUser);
      userDoc = { ...newUser, _id: inserted.insertedId };
    }

    await createSession({
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role || "user",
      avatar: userDoc.avatar || null,
      provider: userDoc.provider || "google",
    });

    const redirectTo =
      from && from.startsWith("/") && !from.startsWith("//")
        ? from
        : userDoc.role === "admin"
          ? "/dashboard"
          : "/";

    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error) {
    console.error("GOOGLE OAUTH CALLBACK ERROR:", error);
    return loginErrorRedirect(request, "google_auth_failed");
  }
}
