import { createHash, randomBytes, randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { comparePassword, hashPassword, toSessionUser, type SessionUser, type UserRow } from "@/lib/auth";
import { createSession, recordLoginEvent } from "@/lib/authSession";
import type {
  LoginInput,
  PasswordResetInput,
  PasswordResetRequestInput,
  ProfileUpdateInput,
  RegisterInput
} from "./schemas";

const TOKEN_TTL_MS = 30 * 60 * 1000;

export class AuthServiceError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status = 400, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function normalizeOptional(value: string | undefined, fallback: string | null) {
  return value === undefined ? fallback : value.trim() || null;
}

export async function loginWithEmail(input: LoginInput, request: Request): Promise<{ user: SessionUser; session: { token: string; expiresAt: Date } }> {
  const user: UserRow | null = await prisma.user.findFirst({
    where: { email: { equals: input.email, mode: "insensitive" } }
  });
  if (!user) {
    throw new AuthServiceError("Invalid email or password.", 401);
  }
  if (!user.passwordHash) {
    throw new AuthServiceError(
      "This account does not have a password yet. Reset your password to continue.",
      403,
      "PASSWORD_RESET_REQUIRED"
    );
  }
  const isValidPassword = await comparePassword(input.password, user.passwordHash);
  if (!isValidPassword) {
    throw new AuthServiceError("Invalid email or password.", 401);
  }

  const session = await prisma.$transaction(async (tx) => {
    const createdSession = await createSession(user.id, "email", tx);
    await recordLoginEvent(user.id, "email", request, tx);
    return createdSession;
  });

  return { user: toSessionUser(user), session };
}

export async function registerWithEmail(input: RegisterInput, request: Request): Promise<{ user: SessionUser; session: { token: string; expiresAt: Date } }> {
  const id = randomUUID();
  const now = new Date();
  const passwordHash = await hashPassword(input.password);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user: UserRow = await tx.user.create({
        data: {
          id,
          email: input.email,
          passwordHash,
          fullName: input.fullName,
          phone: input.phone || null,
          dateOfBirth: input.dateOfBirth || null,
          address: input.address || null,
          city: input.city || null,
          country: input.country || null,
          bio: input.bio || null,
          preferences: input.preferences || null,
          dislikes: input.dislikes || null,
          medicalInfo: input.medicalInfo || null,
          hairPreferences: input.hairPreferences || null,
          nailPreferences: input.nailPreferences || null,
          foodPreferences: input.foodPreferences || null,
          onboardingCompleted: Boolean(input.onboardingCompleted),
          authProvider: "email",
          createdAt: now,
          updatedAt: now
        }
      });
      const session = await createSession(id, "email", tx);
      await recordLoginEvent(id, "email", request, tx);
      return { user, session };
    });

    return { user: toSessionUser(result.user), session: result.session };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AuthServiceError("An account with this email already exists.", 409);
    }
    throw error;
  }
}

export async function getSessionUser(userId: string): Promise<SessionUser> {
  const user: UserRow | null = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AuthServiceError("User not found.", 404);
  }
  return toSessionUser(user);
}

export async function updateProfile(userId: string, input: ProfileUpdateInput): Promise<SessionUser> {
  if (input.id && input.id !== userId) {
    throw new AuthServiceError("You can only edit your own profile.", 403);
  }

  const existingUser: UserRow | null = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new AuthServiceError("User not found.", 404);
  }

  const nextFullName = input.fullName?.trim() || existingUser.fullName;
  if (!nextFullName) {
    throw new AuthServiceError("Full name is required.", 400);
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: nextFullName,
      phone: normalizeOptional(input.phone, existingUser.phone),
      dateOfBirth: normalizeOptional(input.dateOfBirth, existingUser.dateOfBirth),
      address: normalizeOptional(input.address, existingUser.address),
      city: normalizeOptional(input.city, existingUser.city),
      country: normalizeOptional(input.country, existingUser.country),
      bio: normalizeOptional(input.bio, existingUser.bio),
      preferences: normalizeOptional(input.preferences, existingUser.preferences),
      dislikes: normalizeOptional(input.dislikes, existingUser.dislikes),
      medicalInfo: normalizeOptional(input.medicalInfo, existingUser.medicalInfo),
      hairPreferences: normalizeOptional(input.hairPreferences, existingUser.hairPreferences),
      nailPreferences: normalizeOptional(input.nailPreferences, existingUser.nailPreferences),
      foodPreferences: normalizeOptional(input.foodPreferences, existingUser.foodPreferences),
      onboardingCompleted:
        input.onboardingCompleted === undefined
          ? Boolean(existingUser.onboardingCompleted)
          : Boolean(input.onboardingCompleted),
      updatedAt: new Date()
    }
  });

  const user: UserRow | null = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AuthServiceError("User not found.", 404);
  }
  return toSessionUser(user);
}

export async function requestPasswordReset(input: PasswordResetRequestInput): Promise<{ message: string; resetCode?: string }> {
  const user: UserRow | null = await prisma.user.findFirst({
    where: { email: { equals: input.email, mode: "insensitive" } }
  });
  const message = "If the account exists, a password reset code has been generated.";
  if (!user) {
    return { message };
  }

  const token = randomBytes(24).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + TOKEN_TTL_MS);

  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: now }
    }),
    prisma.passwordResetToken.create({
      data: {
        id: randomUUID(),
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt,
        usedAt: null,
        createdAt: now
      }
    })
  ]);

  const shouldExposeResetCode = process.env.EXPOSE_RESET_CODE_IN_RESPONSE === "true";
  if (shouldExposeResetCode && process.env.NODE_ENV !== "production") {
    return { message, resetCode: token };
  }
  return { message };
}

export async function resetPassword(input: PasswordResetInput): Promise<{ message: string }> {
  const user: UserRow | null = await prisma.user.findFirst({
    where: { email: { equals: input.email, mode: "insensitive" } }
  });
  if (!user) {
    throw new AuthServiceError("Invalid reset code or email.", 400);
  }

  const tokenHash = hashToken(input.resetCode.trim().toLowerCase());
  const token = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() }
    },
    orderBy: { createdAt: "desc" },
    select: { id: true }
  });
  if (!token) {
    throw new AuthServiceError("Invalid reset code or email.", 400);
  }

  const passwordHash = await hashPassword(input.password);
  const now = new Date();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, authProvider: "email", updatedAt: now }
    }),
    prisma.passwordResetToken.update({
      where: { id: token.id },
      data: { usedAt: now }
    })
  ]);

  return { message: "Password reset successful. You can now sign in." };
}
