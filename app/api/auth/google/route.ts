import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { get, run } from "@/lib/db";
import { toSessionUser, type UserRow } from "@/lib/auth";
import { verifyGoogleIdToken } from "@/lib/googleAuth";
import { enforceRateLimit } from "@/lib/security";
import { applySessionCookie, createSession, recordLoginEvent } from "@/lib/authSession";

const GOOGLE_WINDOW_MS = 10 * 60 * 1000;
const MAX_GOOGLE_ATTEMPTS = 20;

export async function POST(request: Request) {
  const rateLimit = enforceRateLimit(request, "auth:google", MAX_GOOGLE_ATTEMPTS, GOOGLE_WINDOW_MS);
  if (rateLimit.limited) {
    return NextResponse.json(
      {
        error: "Too many Google sign-in attempts. Please try again later."
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) }
      }
    );
  }

  const body = await request.json();
  const { idToken } = body as { idToken?: string };

  if (!idToken) {
    return NextResponse.json({ error: "Google sign-in requires a valid identity token." }, { status: 400 });
  }

  try {
    const identity = await verifyGoogleIdToken(idToken);
    const normalizedEmail = identity.email.toLowerCase();
    const normalizedName = identity.fullName.trim();

    const existingUser = await get<UserRow>("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
    const now = new Date().toISOString();

    if (existingUser) {
      const provider = existingUser.password_hash ? "hybrid" : "google";
      await run("UPDATE users SET full_name = ?, auth_provider = ?, updated_at = ? WHERE email = ?", [
        normalizedName || existingUser.full_name,
        provider,
        now,
        normalizedEmail
      ]);
    } else {
      await run(
        `INSERT INTO users (id, email, password_hash, full_name, onboarding_completed, auth_provider, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [randomUUID(), normalizedEmail, null, normalizedName, 0, "google", now, now]
      );
    }

    const user = await get<UserRow>("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
    if (!user) {
      return NextResponse.json({ error: "Unable to complete Google sign-in." }, { status: 500 });
    }

    const session = await createSession(user.id, "google");
    await recordLoginEvent(user.id, "google", request);

    const response = NextResponse.json({ user: toSessionUser(user) });
    applySessionCookie(response, session.token, session.expiresAt);
    return response;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Missing GOOGLE_CLIENT_ID")
    ) {
      return NextResponse.json(
        { error: "Google sign-in is not configured on the server." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Google sign-in could not be verified." }, { status: 401 });
  }
}
