import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import type { BookingRow } from "@/lib/bookings";
import type { CreateBookingInput, UpdateBookingInput } from "./schemas";
import { resolveBookingSelection } from "./catalog";
import { BookingInputError } from "./errors";

type BookingScope = "active" | "all";

function readDateTimeParts(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    today: `${get("year")}-${get("month")}-${get("day")}`,
    nowTime: `${get("hour")}:${get("minute")}`
  };
}

function getBookingClock() {
  const timeZone = process.env.BOOKING_TIMEZONE?.trim() || "UTC";
  return readDateTimeParts(new Date(), timeZone);
}

export async function listBookingsForUser(userId: string, scope: BookingScope): Promise<BookingRow[]> {
  if (scope !== "active") {
    return prisma.booking.findMany({
      where: { userId },
      orderBy: [{ bookingDate: "asc" }, { bookingTime: "asc" }, { createdAt: "desc" }]
    });
  }

  const { today, nowTime } = getBookingClock();
  return prisma.booking.findMany({
    where: {
      userId,
      status: { in: ["confirmed", "rescheduled"] },
      OR: [{ bookingDate: { gt: today } }, { bookingDate: today, bookingTime: { gte: nowTime } }]
    },
    orderBy: [{ bookingDate: "asc" }, { bookingTime: "asc" }, { createdAt: "desc" }]
  });
}

export async function createBookingForUser(userId: string, input: CreateBookingInput): Promise<BookingRow> {
  const resolved = resolveBookingSelection(input.popupKey, input.serviceId, input.consultantId);
  const id = randomUUID();
  const now = new Date();

  await prisma.booking.create({
    data: {
      id,
      userId,
      popupKey: resolved.popupKey,
      popupName: resolved.popupName,
      serviceId: resolved.serviceId,
      serviceTitle: resolved.serviceTitle,
      consultantId: resolved.consultantId,
      consultantName: resolved.consultantName,
      bookingDate: input.bookingDate.trim(),
      bookingTime: input.bookingTime.trim(),
      status: "confirmed",
      notes: input.notes?.trim() || null,
      lastAction: "created",
      actionReason: null,
      source: input.source?.trim() || "web",
      createdAt: now,
      updatedAt: now
    }
  });

  const created = await prisma.booking.findUnique({ where: { id } });
  if (!created) {
    throw new Error("Booking creation failed.");
  }
  return created;
}

export async function updateBookingForUser(
  userId: string,
  bookingId: string,
  input: UpdateBookingInput
) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId }
  });
  if (!booking) {
    throw new BookingInputError("Booking not found.", 404);
  }
  if (booking.status === "cancelled") {
    throw new BookingInputError("Cancelled bookings cannot be changed.", 409);
  }

  const normalizedReason = input.reason?.trim() || null;
  const now = new Date();

  if (input.action === "cancel") {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "cancelled",
        lastAction: "cancelled",
        actionReason: normalizedReason,
        updatedAt: now
      }
    });
  } else {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        bookingDate: input.bookingDate!.trim(),
        bookingTime: input.bookingTime!.trim(),
        status: "rescheduled",
        lastAction: "rescheduled",
        actionReason: normalizedReason,
        updatedAt: now
      }
    });
  }

  const updated = await prisma.booking.findFirst({ where: { id: bookingId, userId } });
  if (!updated) {
    throw new Error("Booking update failed.");
  }

  return {
    booking: updated,
    message:
      input.action === "cancel"
        ? "Your appointment has been cancelled."
        : "Your appointment has been changed."
  };
}
