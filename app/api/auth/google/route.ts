import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { get, run } from "@/lib/db";
import { toSessionUser, type UserRow } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, fullName } = body as { email?: string; fullName?: string };
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedName = fullName?.trim();

  if (!normalizedEmail) {
    return NextResponse.json({ error: "Google sign-in requires an email." }, { status: 400 });
  }

  const existingUser = await get<UserRow>("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
  const now = new Date().toISOString();

  if (existingUser) {
    await run("UPDATE users SET full_name = ?, auth_provider = ?, updated_at = ? WHERE email = ?", [normalizedName || existingUser.full_name, "google", now, normalizedEmail]);
  } else {
    await run(
      `INSERT INTO users (id, email, password_hash, full_name, onboarding_completed, auth_provider, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), normalizedEmail, null, normalizedName || normalizedEmail.split("@")[0], 0, "google", now, now]
    );
  }

  const user = await get<UserRow>("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
  return NextResponse.json({ user: user ? toSessionUser(user) : null });
}
