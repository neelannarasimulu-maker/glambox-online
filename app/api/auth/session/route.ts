import { NextResponse } from "next/server";
import { toSessionUser, type UserRow } from "@/lib/auth";
import { get } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/authSession";

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await get<UserRow>("SELECT * FROM users WHERE id = ?", [userId]);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  return NextResponse.json({ user: toSessionUser(user) });
}
