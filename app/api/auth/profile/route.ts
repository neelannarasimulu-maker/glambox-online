import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/authSession";
import { isTrustedOrigin } from "@/lib/security";
import { AuthServiceError, getSessionUser, updateProfile } from "@/modules/auth/service";
import { profileUpdateInputSchema } from "@/modules/auth/schemas";

export async function GET() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const user = await getSessionUser(userId);
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Failed to load profile", error);
    return NextResponse.json({ error: "Could not load profile." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = profileUpdateInputSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message || "Invalid profile update payload.";
    return NextResponse.json({ error: issue }, { status: 400 });
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const user = await updateProfile(userId, parsed.data);
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Failed to update profile", error);
    return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
  }
}
