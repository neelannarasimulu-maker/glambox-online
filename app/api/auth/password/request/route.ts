import { createHash, randomBytes, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { get, run } from "@/lib/db";
import { type UserRow } from "@/lib/auth";
import { emailSchema, enforceRateLimit } from "@/lib/security";

const RESET_REQUEST_WINDOW_MS = 15 * 60 * 1000;
const MAX_RESET_REQUEST_ATTEMPTS = 8;
const TOKEN_TTL_MS = 30 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  const rateLimit = enforceRateLimit(
    request,
    "auth:password:request",
    MAX_RESET_REQUEST_ATTEMPTS,
    RESET_REQUEST_WINDOW_MS
  );
  if (rateLimit.limited) {
    return NextResponse.json(
      { error: "Too many reset requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) }
      }
    );
  }

  const body = await request.json();
  const { email } = body as { email?: string };
  const parsedEmail = emailSchema.safeParse(email);
  if (!parsedEmail.success) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const user = await get<UserRow>("SELECT * FROM users WHERE lower(email) = ?", [parsedEmail.data]);
  if (!user) {
    return NextResponse.json({
      message: "If the account exists, a password reset code has been generated."
    });
  }

  const token = randomBytes(24).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + TOKEN_TTL_MS).toISOString();

  await run("UPDATE password_reset_tokens SET used_at = ? WHERE user_id = ? AND used_at IS NULL", [
    now.toISOString(),
    user.id
  ]);

  await run(
    `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, used_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [randomUUID(), user.id, hashToken(token), expiresAt, null, now.toISOString()]
  );

  return NextResponse.json({
    message: "If the account exists, a password reset code has been generated.",
    resetCode: token
  });
}
