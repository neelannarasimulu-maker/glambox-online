import { z } from "zod";

const EMAIL_MAX_LENGTH = 254;
const NAME_MAX_LENGTH = 120;
const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_MAX_LENGTH = 128;

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please enter a valid email address.")
  .max(EMAIL_MAX_LENGTH, "Email is too long.");

export const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Full name is required.")
  .max(NAME_MAX_LENGTH, "Full name is too long.");

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
  .max(PASSWORD_MAX_LENGTH, "Password is too long.")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
  .regex(/[a-z]/, "Password must include at least one lowercase letter.")
  .regex(/[0-9]/, "Password must include at least one number.")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one special character.");

type Bucket = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, Bucket>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

export function enforceRateLimit(request: Request, action: string, maxAttempts: number, windowMs: number) {
  const now = Date.now();
  const clientIp = getClientIp(request);
  const key = `${action}:${clientIp}`;
  const bucket = rateLimitStore.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs
    });
    return { limited: false as const };
  }

  if (bucket.count >= maxAttempts) {
    return {
      limited: true as const,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
    };
  }

  bucket.count += 1;
  return { limited: false as const };
}
