import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/security";
import { requestPasswordReset } from "@/modules/auth/service";
import { passwordResetRequestInputSchema } from "@/modules/auth/schemas";

const RESET_REQUEST_WINDOW_MS = 15 * 60 * 1000;
const MAX_RESET_REQUEST_ATTEMPTS = 8;
export async function POST(request: Request) {
  const rateLimit = await enforceRateLimit(
    request,
    "auth:password:request",
    MAX_RESET_REQUEST_ATTEMPTS,
    RESET_REQUEST_WINDOW_MS
  );
  if (rateLimit.limited) {
    return NextResponse.json(
      { error: "Too many reset requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) }
      }
    );
  }

  const body = await request.json();
  const parsed = passwordResetRequestInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const payload = await requestPasswordReset(parsed.data);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Failed to request password reset", error);
    return NextResponse.json({ error: "Could not process password reset request." }, { status: 500 });
  }
}
