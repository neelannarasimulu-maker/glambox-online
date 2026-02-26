import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/security";
import { applySessionCookie } from "@/lib/authSession";
import { AuthServiceError, registerWithEmail } from "@/modules/auth/service";
import { registerInputSchema } from "@/modules/auth/schemas";

const REGISTER_WINDOW_MS = 30 * 60 * 1000;
const MAX_REGISTER_ATTEMPTS = 10;

export async function POST(request: Request) {
  const rateLimit = await enforceRateLimit(
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
  const parsed = registerInputSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message || "Invalid registration payload.";
    return NextResponse.json({ error: issue }, { status: 400 });
  }

  try {
    const result = await registerWithEmail(parsed.data, request);
    const response = NextResponse.json({ user: result.user }, { status: 201 });
    applySessionCookie(response, result.session.token, result.session.expiresAt);
    return response;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Failed to register user", error);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
