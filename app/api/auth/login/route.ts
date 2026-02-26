import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/security";
import { applySessionCookie } from "@/lib/authSession";
import { AuthServiceError, loginWithEmail } from "@/modules/auth/service";
import { loginInputSchema } from "@/modules/auth/schemas";

const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 12;

export async function POST(request: Request) {
  const rateLimit = await enforceRateLimit(request, "auth:login", MAX_LOGIN_ATTEMPTS, LOGIN_WINDOW_MS);
  if (rateLimit.limited) {
    return NextResponse.json(
      {
        error: "Too many login attempts. Please try again later."
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) }
      }
    );
  }

  const body = await request.json();
  const parsed = loginInputSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message || "Email and password are required.";
    return NextResponse.json({ error: issue }, { status: 400 });
  }

  try {
    const result = await loginWithEmail(parsed.data, request);
    const response = NextResponse.json({ user: result.user });
    applySessionCookie(response, result.session.token, result.session.expiresAt);
    return response;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }
    console.error("Failed to log in", error);
    return NextResponse.json({ error: "Could not complete sign in." }, { status: 500 });
  }
}
