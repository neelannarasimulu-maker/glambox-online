import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { get, run } from "@/lib/db";
import { hashPassword, toSessionUser, type UserRow } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, fullName, phone, dateOfBirth, address, city, country, bio } = body as {
    email?: string;
    password?: string;
    fullName?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    country?: string;
    bio?: string;
  };

  if (!email || !password || !fullName) {
    return NextResponse.json({ error: "Email, password, and full name are required." }, { status: 400 });
  }

  const existingUser = await get<UserRow>("SELECT * FROM users WHERE email = ?", [email]);
  if (existingUser) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const id = randomUUID();
  const now = new Date().toISOString();
  const passwordHash = await hashPassword(password);

  await run(
    `INSERT INTO users (id, email, password_hash, full_name, phone, date_of_birth, address, city, country, bio, auth_provider, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, email, passwordHash, fullName, phone || null, dateOfBirth || null, address || null, city || null, country || null, bio || null, "email", now, now]
  );

  const user = await get<UserRow>("SELECT * FROM users WHERE id = ?", [id]);
  return NextResponse.json({ user: user ? toSessionUser(user) : null }, { status: 201 });
}
