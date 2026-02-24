import { NextResponse } from "next/server";
import { comparePassword, toSessionUser, type UserRow } from "@/lib/auth";
import { get } from "@/lib/db";
import { emailSchema, enforceRateLimit } from "@/lib/security";
import { applySessionCookie, createSession, recordLoginEvent } from "@/lib/authSession";

const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 12;

export async function POST(request: Request) {
  const rateLimit = enforceRateLimit(request, "auth:login", MAX_LOGIN_ATTEMPTS, LOGIN_WINDOW_MS);
  if (rateLimit.limited) {
    return NextResponse.json(
      {
        error: "Too many login attempts. Please try again later."
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) }
      }
    );
  }

  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  const parsedEmail = emailSchema.safeParse(email);
  if (!parsedEmail.success || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await get<UserRow>("SELECT * FROM users WHERE lower(email) = ?", [parsedEmail.data]);
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (!user.password_hash) {
    return NextResponse.json(
      {
        error: "This account does not have a password yet. Reset your password to continue.",
        code: "PASSWORD_RESET_REQUIRED"
      },
      { status: 403 }
    );
  }

  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const session = await createSession(user.id, "email");
  await recordLoginEvent(user.id, "email", request);

  const response = NextResponse.json({ user: toSessionUser(user) });
  applySessionCookie(response, session.token, session.expiresAt);
  return response;
}
