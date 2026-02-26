import { NextResponse } from "next/server";
import { toBooking, type BookingRow } from "@/lib/bookings";
import { getAuthenticatedUserId } from "@/lib/authSession";
import { isTrustedOrigin } from "@/lib/security";
import { createBookingInputSchema } from "@/modules/bookings/schemas";
import {
  createBookingForUser,
  listBookingsForUser
} from "@/modules/bookings/service";
import { BookingInputError } from "@/modules/bookings/errors";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope")?.trim();

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const rows: BookingRow[] = await listBookingsForUser(userId, scope === "active" ? "active" : "all");

    return NextResponse.json(
      { bookings: rows.map(toBooking) },
      {
        headers: {
          "Cache-Control": "private, max-age=15, stale-while-revalidate=60"
        }
      }
    );
  } catch (error) {
    console.error("Failed to load bookings", error);
    return NextResponse.json(
      { error: "Could not load bookings." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isTrustedOrigin(request)) {
      return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
    }

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createBookingInputSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0]?.message || "Invalid booking payload.";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const row = await createBookingForUser(userId, parsed.data);
    return NextResponse.json(
      { booking: toBooking(row) },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof BookingInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to create booking", error);
    return NextResponse.json(
      { error: "Could not create booking." },
      { status: 500 }
    );
  }
}
