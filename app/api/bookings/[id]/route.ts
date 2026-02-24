import { NextResponse } from "next/server";
import { get, run } from "@/lib/db";
import { toBooking, type BookingRow } from "@/lib/bookings";
import type { UserRow } from "@/lib/auth";

type UpdateAction = "reschedule" | "cancel";
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id?.trim();
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required." }, { status: 400 });
    }

    const body = await request.json();
    const { userId, action, bookingDate, bookingTime, reason } = body as {
      userId?: string;
      action?: UpdateAction;
      bookingDate?: string;
      bookingTime?: string;
      reason?: string;
    };

    if (!userId?.trim()) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }
    if (action !== "reschedule" && action !== "cancel") {
      return NextResponse.json({ error: "Action must be reschedule or cancel." }, { status: 400 });
    }

    const existingUser = await get<UserRow>("SELECT * FROM users WHERE id = ?", [userId.trim()]);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const booking = await get<BookingRow>("SELECT * FROM bookings WHERE id = ? AND user_id = ?", [
      bookingId,
      userId.trim()
    ]);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    if (booking.status === "cancelled") {
      return NextResponse.json({ error: "Cancelled bookings cannot be changed." }, { status: 409 });
    }

    const normalizedReason = reason?.trim() || null;
    const now = new Date().toISOString();

    if (action === "cancel") {
      await run(
        `UPDATE bookings
         SET status = ?, last_action = ?, action_reason = ?, updated_at = ?
         WHERE id = ? AND user_id = ?`,
        ["cancelled", "cancelled", normalizedReason, now, bookingId, userId.trim()]
      );
    } else {
      if (!bookingDate?.trim() || !bookingTime?.trim()) {
        return NextResponse.json(
          { error: "bookingDate and bookingTime are required for reschedule." },
          { status: 400 }
        );
      }
      if (!DATE_REGEX.test(bookingDate.trim())) {
        return NextResponse.json({ error: "bookingDate must be in YYYY-MM-DD format." }, { status: 400 });
      }
      if (!TIME_REGEX.test(bookingTime.trim())) {
        return NextResponse.json({ error: "bookingTime must be in HH:MM 24-hour format." }, { status: 400 });
      }

      await run(
        `UPDATE bookings
         SET booking_date = ?, booking_time = ?, status = ?, last_action = ?, action_reason = ?, updated_at = ?
         WHERE id = ? AND user_id = ?`,
        [
          bookingDate.trim(),
          bookingTime.trim(),
          "rescheduled",
          "rescheduled",
          normalizedReason,
          now,
          bookingId,
          userId.trim()
        ]
      );
    }

    const updated = await get<BookingRow>("SELECT * FROM bookings WHERE id = ? AND user_id = ?", [
      bookingId,
      userId.trim()
    ]);

    return NextResponse.json(
      {
        booking: updated ? toBooking(updated) : null,
        message:
          action === "cancel"
            ? "Your appointment has been cancelled."
            : "Your appointment has been changed."
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update appointment." },
      { status: 500 }
    );
  }
}
