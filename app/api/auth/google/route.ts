import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { get, run } from "@/lib/db";
import { toSessionUser, type UserRow } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, fullName } = body as { email?: string; fullName?: string };

  if (!email) {
    return NextResponse.json({ error: "Google sign-in requires an email." }, { status: 400 });
  }

  const existingUser = await get<UserRow>("SELECT * FROM users WHERE email = ?", [email]);
  const now = new Date().toISOString();

  if (existingUser) {
    await run("UPDATE users SET full_name = ?, auth_provider = ?, updated_at = ? WHERE email = ?", [fullName || existingUser.full_name, "google", now, email]);
  } else {
    await run(
      `INSERT INTO users (id, email, password_hash, full_name, auth_provider, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), email, null, fullName || email.split("@")[0], "google", now, now]
    );
  }

  const user = await get<UserRow>("SELECT * FROM users WHERE email = ?", [email]);
  return NextResponse.json({ user: user ? toSessionUser(user) : null });
}
