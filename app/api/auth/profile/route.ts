import { NextResponse } from "next/server";
import { get, run } from "@/lib/db";
import { toSessionUser, type UserRow } from "@/lib/auth";
import { getAuthenticatedUserId } from "@/lib/authSession";

export async function GET() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const user = await get<UserRow>("SELECT * FROM users WHERE id = ?", [userId]);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user: toSessionUser(user) });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const {
    id,
    fullName,
    phone,
    dateOfBirth,
    address,
    city,
    country,
    bio,
    preferences,
    dislikes,
    medicalInfo,
    hairPreferences,
    nailPreferences,
    foodPreferences,
    onboardingCompleted
  } = body as {
    id?: string;
    fullName?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    country?: string;
    bio?: string;
    preferences?: string;
    dislikes?: string;
    medicalInfo?: string;
    hairPreferences?: string;
    nailPreferences?: string;
    foodPreferences?: string;
    onboardingCompleted?: boolean;
  };

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (id && id !== userId) {
    return NextResponse.json({ error: "You can only edit your own profile." }, { status: 403 });
  }

  const existingUser = await get<UserRow>("SELECT * FROM users WHERE id = ?", [userId]);
  if (!existingUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const nextFullName = fullName?.trim() || existingUser.full_name;
  if (!nextFullName) {
    return NextResponse.json({ error: "Full name is required." }, { status: 400 });
  }

  const normalizeOptional = (value: string | undefined, fallback: string | null) =>
    value === undefined ? fallback : value.trim() || null;

  await run(
    `UPDATE users SET full_name = ?, phone = ?, date_of_birth = ?, address = ?, city = ?, country = ?, bio = ?, preferences = ?, dislikes = ?, medical_info = ?, hair_preferences = ?, nail_preferences = ?, food_preferences = ?, onboarding_completed = ?, updated_at = ? WHERE id = ?`,
    [
      nextFullName,
      normalizeOptional(phone, existingUser.phone),
      normalizeOptional(dateOfBirth, existingUser.date_of_birth),
      normalizeOptional(address, existingUser.address),
      normalizeOptional(city, existingUser.city),
      normalizeOptional(country, existingUser.country),
      normalizeOptional(bio, existingUser.bio),
      normalizeOptional(preferences, existingUser.preferences),
      normalizeOptional(dislikes, existingUser.dislikes),
      normalizeOptional(medicalInfo, existingUser.medical_info),
      normalizeOptional(hairPreferences, existingUser.hair_preferences),
      normalizeOptional(nailPreferences, existingUser.nail_preferences),
      normalizeOptional(foodPreferences, existingUser.food_preferences),
      onboardingCompleted === undefined
        ? existingUser.onboarding_completed ?? 0
        : onboardingCompleted
          ? 1
          : 0,
      new Date().toISOString(),
      userId
    ]
  );

  const user = await get<UserRow>("SELECT * FROM users WHERE id = ?", [userId]);
  return NextResponse.json({ user: user ? toSessionUser(user) : null });
}
