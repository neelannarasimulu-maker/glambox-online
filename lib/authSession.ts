import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { get, run } from "@/lib/db";

const SESSION_COOKIE_NAME = "glambox_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;

type SessionRow = {
  id: string;
  user_id: string;
  token_hash: string;
  provider: string;
  expires_at: string;
  revoked_at: string | null;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function buildCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires
  };
}

export async function createSession(userId: string, provider: string) {
  const token = randomBytes(48).toString("hex");
  const id = randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await run(
    `INSERT INTO auth_sessions (id, user_id, token_hash, provider, expires_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, hashToken(token), provider, expiresAt.toISOString(), new Date().toISOString(), new Date().toISOString()]
  );

  return { token, expiresAt };
}

export function applySessionCookie(response: NextResponse, token: string, expiresAt: Date) {
  response.cookies.set(SESSION_COOKIE_NAME, token, buildCookieOptions(expiresAt));
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", buildCookieOptions(new Date(0)));
}

export async function revokeSessionByCookie() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return;
  }

  const tokenHash = hashToken(token);
  await run(
    "UPDATE auth_sessions SET revoked_at = ?, updated_at = ? WHERE token_hash = ? AND revoked_at IS NULL",
    [new Date().toISOString(), new Date().toISOString(), tokenHash]
  );
}

export async function getAuthenticatedUserId() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const now = new Date().toISOString();
  const session = await get<SessionRow>(
    "SELECT * FROM auth_sessions WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > ?",
    [hashToken(token), now]
  );

  if (!session) {
    return null;
  }

  return session.user_id;
}

export async function recordLoginEvent(userId: string, provider: string, request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const userAgent = request.headers.get("user-agent") || null;

  await run(
    `INSERT INTO auth_login_events (id, user_id, provider, ip_address, user_agent, occurred_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [randomBytes(16).toString("hex"), userId, provider, ip, userAgent, new Date().toISOString()]
  );
}
