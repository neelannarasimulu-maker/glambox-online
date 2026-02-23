import { NextResponse } from "next/server";
import { comparePassword, toSessionUser, type UserRow } from "@/lib/auth";
import { get } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await get<UserRow>("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (!user.password_hash && user.auth_provider === "google") {
    return NextResponse.json(
      {
        error: "This account uses Google sign-in.",
        code: "ACCOUNT_PROVIDER_REQUIRED",
        provider: "google"
      },
      { status: 409 }
    );
  }

  if (!user.password_hash) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  return NextResponse.json({ user: toSessionUser(user) });
}
