import { NextResponse } from "next/server";
import { comparePassword, toSessionUser, type UserRow } from "@/lib/auth";
import { get } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await get<UserRow>("SELECT * FROM users WHERE email = ?", [email]);
  if (!user || !user.password_hash) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  return NextResponse.json({ user: toSessionUser(user) });
}
