import { NextResponse } from "next/server";
import { get, run } from "@/lib/db";
import { toSessionUser, type UserRow } from "@/lib/auth";

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, fullName, phone, dateOfBirth, address, city, country, bio } = body as {
    id?: string;
    fullName?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    country?: string;
    bio?: string;
  };

  if (!id || !fullName) {
    return NextResponse.json({ error: "User ID and full name are required." }, { status: 400 });
  }

  await run(
    `UPDATE users SET full_name = ?, phone = ?, date_of_birth = ?, address = ?, city = ?, country = ?, bio = ?, updated_at = ? WHERE id = ?`,
    [fullName, phone || null, dateOfBirth || null, address || null, city || null, country || null, bio || null, new Date().toISOString(), id]
  );

  const user = await get<UserRow>("SELECT * FROM users WHERE id = ?", [id]);
  return NextResponse.json({ user: user ? toSessionUser(user) : null });
}
