import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/authSession";
import { AuthServiceError, getSessionUser } from "@/modules/auth/service";

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = await getSessionUser(userId);
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof AuthServiceError && error.status === 404) {
      return NextResponse.json({ user: null }, { status: 404 });
    }
    console.error("Failed to fetch session user", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
