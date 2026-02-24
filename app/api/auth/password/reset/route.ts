import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { get, run } from "@/lib/db";
import { hashPassword, type UserRow } from "@/lib/auth";
import { emailSchema, enforceRateLimit, passwordSchema } from "@/lib/security";

const RESET_WINDOW_MS = 15 * 60 * 1000;
const MAX_RESET_ATTEMPTS = 10;

type ResetTokenRow = {
  id: string;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  const rateLimit = enforceRateLimit(request, "auth:password:reset", MAX_RESET_ATTEMPTS, RESET_WINDOW_MS);
  if (rateLimit.limited) {
    return NextResponse.json(
      { error: "Too many reset attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) }
      }
    );
  }

  const body = await request.json();
  const { email, resetCode, password } = body as {
    email?: string;
    resetCode?: string;
    password?: string;
  };

  const parsedEmail = emailSchema.safeParse(email);
  const parsedPassword = passwordSchema.safeParse(password);
  if (!parsedEmail.success || !resetCode?.trim()) {
    return NextResponse.json({ error: "Email, reset code, and new password are required." }, { status: 400 });
  }
  if (!parsedPassword.success) {
    return NextResponse.json({ error: parsedPassword.error.issues[0]?.message || "Invalid password." }, { status: 400 });
  }

  const user = await get<UserRow>("SELECT * FROM users WHERE lower(email) = ?", [parsedEmail.data]);
  if (!user) {
    return NextResponse.json({ error: "Invalid reset code or email." }, { status: 400 });
  }

  const tokenHash = hashToken(resetCode.trim().toLowerCase());
  const token = await get<ResetTokenRow>(
    `SELECT id FROM password_reset_tokens
     WHERE user_id = ? AND token_hash = ? AND used_at IS NULL AND expires_at > ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [user.id, tokenHash, new Date().toISOString()]
  );

  if (!token) {
    return NextResponse.json({ error: "Invalid reset code or email." }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsedPassword.data);
  const now = new Date().toISOString();

  await run("UPDATE users SET password_hash = ?, auth_provider = ?, updated_at = ? WHERE id = ?", [
    passwordHash,
    "email",
    now,
    user.id
  ]);
  await run("UPDATE password_reset_tokens SET used_at = ? WHERE id = ?", [now, token.id]);

  return NextResponse.json({ message: "Password reset successful. You can now sign in." });
}
