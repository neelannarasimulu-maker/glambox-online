import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/security";
import { AuthServiceError, resetPassword } from "@/modules/auth/service";
import { passwordResetInputSchema } from "@/modules/auth/schemas";

const RESET_WINDOW_MS = 15 * 60 * 1000;
const MAX_RESET_ATTEMPTS = 10;

export async function POST(request: Request) {
  const rateLimit = await enforceRateLimit(
    request,
    "auth:password:reset",
    MAX_RESET_ATTEMPTS,
    RESET_WINDOW_MS
  );
  if (rateLimit.limited) {
    return NextResponse.json(
      { error: "Too many reset attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) }
      }
    );
  }

  const body = await request.json();
  const parsed = passwordResetInputSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message || "Email, reset code, and new password are required.";
    return NextResponse.json({ error: issue }, { status: 400 });
  }

  try {
    const payload = await resetPassword(parsed.data);
    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Failed to reset password", error);
    return NextResponse.json({ error: "Could not reset password." }, { status: 500 });
  }
}
