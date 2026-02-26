import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/db";

const SESSION_COOKIE_NAME = "glambox_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;
type DbClient = PrismaClient | Prisma.TransactionClient;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function buildCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires
  };
}

export async function createSession(userId: string, provider: string, db: DbClient = prisma) {
  const token = randomBytes(48).toString("hex");
  const id = randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const now = new Date();

  await db.authSession.create({
    data: {
      id,
      userId,
      tokenHash: hashToken(token),
      provider,
      expiresAt,
      createdAt: now,
      updatedAt: now
    }
  });

  return { token, expiresAt };
}

export function applySessionCookie(response: NextResponse, token: string, expiresAt: Date) {
  response.cookies.set(SESSION_COOKIE_NAME, token, buildCookieOptions(expiresAt));
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", buildCookieOptions(new Date(0)));
}

export async function revokeSessionByCookie() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return;
  }

  const tokenHash = hashToken(token);
  await prisma.authSession.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date(), updatedAt: new Date() }
  });
}

export async function getAuthenticatedUserId() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const session = await prisma.authSession.findFirst({
    where: {
      tokenHash: hashToken(token),
      revokedAt: null,
      expiresAt: { gt: new Date() }
    }
  });

  if (!session) {
    return null;
  }

  return session.userId;
}

export async function recordLoginEvent(
  userId: string,
  provider: string,
  request: Request,
  db: DbClient = prisma
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const userAgent = request.headers.get("user-agent") || null;

  await db.authLoginEvent.create({
    data: {
      id: randomBytes(16).toString("hex"),
      userId,
      provider,
      ipAddress: ip,
      userAgent,
      occurredAt: new Date()
    }
  });
}
