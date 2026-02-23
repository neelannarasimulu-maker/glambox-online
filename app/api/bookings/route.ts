import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { all, get, run } from "@/lib/db";
import { toBooking, type BookingRow } from "@/lib/bookings";
import type { UserRow } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId")?.trim();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required." }, { status: 400 });
  }

  const existingUser = await get<UserRow>("SELECT * FROM users WHERE id = ?", [userId]);
  if (!existingUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const rows = await all<BookingRow>(
    `SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date ASC, booking_time ASC, created_at DESC`,
    [userId]
  );

  return NextResponse.json({ bookings: rows.map(toBooking) });
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    userId,
    popupKey,
    popupName,
    serviceId,
    serviceTitle,
    consultantId,
    consultantName,
    bookingDate,
    bookingTime,
    notes,
    source
  } = body as {
    userId?: string;
    popupKey?: string;
    popupName?: string;
    serviceId?: string;
    serviceTitle?: string;
    consultantId?: string;
    consultantName?: string;
    bookingDate?: string;
    bookingTime?: string;
    notes?: string;
    source?: string;
  };

  if (
    !userId ||
    !popupKey ||
    !popupName ||
    !serviceId ||
    !serviceTitle ||
    !consultantId ||
    !consultantName ||
    !bookingDate ||
    !bookingTime
  ) {
    return NextResponse.json({ error: "Missing required booking details." }, { status: 400 });
  }

  const existingUser = await get<UserRow>("SELECT * FROM users WHERE id = ?", [userId]);
  if (!existingUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const id = randomUUID();
  await run(
    `INSERT INTO bookings (
      id, user_id, popup_key, popup_name, service_id, service_title, consultant_id, consultant_name, booking_date, booking_time, status, notes, source, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      userId,
      popupKey,
      popupName,
      serviceId,
      serviceTitle,
      consultantId,
      consultantName,
      bookingDate,
      bookingTime,
      "confirmed",
      notes?.trim() || null,
      source?.trim() || "web",
      now,
      now
    ]
  );

  const row = await get<BookingRow>("SELECT * FROM bookings WHERE id = ?", [id]);
  return NextResponse.json({ booking: row ? toBooking(row) : null }, { status: 201 });
}
