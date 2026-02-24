import { NextResponse } from "next/server";
import { clearSessionCookie, revokeSessionByCookie } from "@/lib/authSession";

export async function POST() {
  await revokeSessionByCookie();
  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  return response;
}
