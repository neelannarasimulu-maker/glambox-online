import { NextResponse } from "next/server";
import { toBooking, type BookingRow } from "@/lib/bookings";
import { getAuthenticatedUserId } from "@/lib/authSession";
import { isTrustedOrigin } from "@/lib/security";
import { updateBookingInputSchema } from "@/modules/bookings/schemas";
import { updateBookingForUser } from "@/modules/bookings/service";
import { BookingInputError } from "@/modules/bookings/errors";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isTrustedOrigin(request)) {
      return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
    }

    const bookingId = params.id?.trim();
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required." }, { status: 400 });
    }

    const body = await request.json();
    const parsed = updateBookingInputSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0]?.message || "Invalid update payload.";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const normalizedUserId = await getAuthenticatedUserId();
    if (!normalizedUserId) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const updatedResult = await updateBookingForUser(normalizedUserId, bookingId, parsed.data);
    const updated: BookingRow = updatedResult.booking;

    return NextResponse.json(
      {
        booking: toBooking(updated),
        message: updatedResult.message
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof BookingInputError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Failed to update booking", error);
    return NextResponse.json(
      { error: "Could not update appointment." },
      { status: 500 }
    );
  }
}
