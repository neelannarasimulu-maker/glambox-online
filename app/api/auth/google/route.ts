import { NextResponse } from "next/server";

export async function POST(request: Request) {
  void request;
  return NextResponse.json(
    { error: "Google OAuth sign-in is disabled. Use email/password and reset password if needed." },
    { status: 410 }
  );
}
