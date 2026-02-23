import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { get, run } from "@/lib/db";
import { hashPassword, toSessionUser, type UserRow } from "@/lib/auth";
import {
  emailSchema,
  enforceRateLimit,
  fullNameSchema,
  passwordSchema
} from "@/lib/security";
import { applySessionCookie, createSession, recordLoginEvent } from "@/lib/authSession";

const REGISTER_WINDOW_MS = 30 * 60 * 1000;
const MAX_REGISTER_ATTEMPTS = 10;

export async function POST(request: Request) {
  const rateLimit = enforceRateLimit(
    request,
    "auth:register",
    MAX_REGISTER_ATTEMPTS,
    REGISTER_WINDOW_MS
  );

  if (rateLimit.limited) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) }
      }
    );
  }

  const body = await request.json();
  const {
    email,
    password,
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
    email?: string;
    password?: string;
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

  const parsedEmail = emailSchema.safeParse(email);
  const parsedPassword = passwordSchema.safeParse(password);
  const parsedName = fullNameSchema.safeParse(fullName);

  if (!parsedEmail.success || !parsedPassword.success || !parsedName.success) {
    return NextResponse.json(
      {
        error:
          parsedEmail.error?.issues[0]?.message ||
          parsedPassword.error?.issues[0]?.message ||
          parsedName.error?.issues[0]?.message ||
          "Email, password, and full name are required."
      },
      { status: 400 }
    );
  }

  const existingUser = await get<UserRow>("SELECT * FROM users WHERE email = ?", [parsedEmail.data]);
  if (existingUser) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const id = randomUUID();
  const now = new Date().toISOString();
  const passwordHash = await hashPassword(parsedPassword.data);

  await run(
    `INSERT INTO users (id, email, password_hash, full_name, phone, date_of_birth, address, city, country, bio, preferences, dislikes, medical_info, hair_preferences, nail_preferences, food_preferences, onboarding_completed, auth_provider, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      parsedEmail.data,
      passwordHash,
      parsedName.data,
      phone || null,
      dateOfBirth || null,
      address || null,
      city || null,
      country || null,
      bio || null,
      preferences || null,
      dislikes || null,
      medicalInfo || null,
      hairPreferences || null,
      nailPreferences || null,
      foodPreferences || null,
      onboardingCompleted ? 1 : 0,
      "email",
      now,
      now
    ]
  );

  const user = await get<UserRow>("SELECT * FROM users WHERE id = ?", [id]);
  const session = await createSession(id, "email");
  await recordLoginEvent(id, "email", request);

  const response = NextResponse.json({ user: user ? toSessionUser(user) : null }, { status: 201 });
  applySessionCookie(response, session.token, session.expiresAt);
  return response;
}
