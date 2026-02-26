import { prisma } from "@/lib/db";
export { emailSchema, fullNameSchema, passwordSchema } from "@/lib/validation";

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

type RateLimitRow = {
  count: number;
  expires_at: Date;
};

function getWindowBounds(windowMs: number) {
  const now = Date.now();
  const windowStartMs = Math.floor(now / windowMs) * windowMs;
  const expiresAtMs = windowStartMs + windowMs;
  return { now, windowStartMs, expiresAtMs };
}

let lastRateLimitGcAt = 0;
const RATE_LIMIT_GC_INTERVAL_MS = 5 * 60 * 1000;

async function cleanupExpiredRateLimits() {
  const now = Date.now();
  if (now - lastRateLimitGcAt < RATE_LIMIT_GC_INTERVAL_MS) {
    return;
  }

  lastRateLimitGcAt = now;
  await prisma.$executeRaw`
    DELETE FROM "api_rate_limits"
    WHERE "expires_at" < NOW()
  `;
}

export async function enforceRateLimit(
  request: Request,
  action: string,
  maxAttempts: number,
  windowMs: number
) {
  const clientIp = getClientIp(request);
  const key = `${action}:${clientIp}`;
  const { now, windowStartMs, expiresAtMs } = getWindowBounds(windowMs);

  const rows = await prisma.$queryRaw<RateLimitRow[]>`
    INSERT INTO "api_rate_limits" ("key", "count", "window_started_at", "expires_at", "updated_at")
    VALUES (
      ${key},
      1,
      TO_TIMESTAMP(${windowStartMs}::double precision / 1000.0),
      TO_TIMESTAMP(${expiresAtMs}::double precision / 1000.0),
      NOW()
    )
    ON CONFLICT ("key")
    DO UPDATE SET
      "count" = CASE
        WHEN "api_rate_limits"."expires_at" <= NOW() THEN 1
        ELSE "api_rate_limits"."count" + 1
      END,
      "window_started_at" = CASE
        WHEN "api_rate_limits"."expires_at" <= NOW()
          THEN TO_TIMESTAMP(${windowStartMs}::double precision / 1000.0)
        ELSE "api_rate_limits"."window_started_at"
      END,
      "expires_at" = CASE
        WHEN "api_rate_limits"."expires_at" <= NOW()
          THEN TO_TIMESTAMP(${expiresAtMs}::double precision / 1000.0)
        ELSE "api_rate_limits"."expires_at"
      END,
      "updated_at" = NOW()
    RETURNING "count", "expires_at"
  `;

  const bucket = rows[0];
  if (!bucket) {
    return { limited: false as const };
  }

  if (bucket.count > maxAttempts) {
    return {
      limited: true as const,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.expires_at.getTime() - now) / 1000))
    };
  }

  if (Math.random() < 0.02) {
    void cleanupExpiredRateLimits();
  }

  return { limited: false as const };
}

function parseTrustedOriginsFromEnv() {
  return (process.env.CSRF_TRUSTED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function isTrustedOrigin(request: Request) {
  const originHeader = request.headers.get("origin");
  if (!originHeader) {
    return false;
  }

  let origin: URL;
  try {
    origin = new URL(originHeader);
  } catch {
    return false;
  }

  const trustedOrigins = parseTrustedOriginsFromEnv();
  if (trustedOrigins.includes(origin.origin)) {
    return true;
  }

  let requestOrigin: string | null = null;
  try {
    requestOrigin = new URL(request.url).origin;
  } catch {
    requestOrigin = null;
  }

  if (requestOrigin && origin.origin === requestOrigin) {
    return true;
  }

  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "")
    .split(",")[0]
    ?.trim();
  const proto = (request.headers.get("x-forwarded-proto") || "https")
    .split(",")[0]
    ?.trim();

  if (!host || !proto) {
    return false;
  }

  return origin.origin === `${proto}://${host}`;
}
