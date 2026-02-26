import { NextResponse } from "next/server";
import { clearSessionCookie, revokeSessionByCookie } from "@/lib/authSession";
import { isTrustedOrigin } from "@/lib/security";

export async function POST(request: Request) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }

  await revokeSessionByCookie();
  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  return response;
}
