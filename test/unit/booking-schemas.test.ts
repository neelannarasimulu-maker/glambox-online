import test from "node:test";
import assert from "node:assert/strict";
import { createBookingInputSchema, updateBookingInputSchema } from "@/modules/bookings/schemas";

test("create booking schema validates expected fields", () => {
  const parsed = createBookingInputSchema.safeParse({
    popupKey: "hair",
    serviceId: "signature-cut",
    consultantId: "noah",
    bookingDate: "2026-03-01",
    bookingTime: "14:30"
  });
  assert.equal(parsed.success, true);
});

test("create booking schema rejects invalid time format", () => {
  const parsed = createBookingInputSchema.safeParse({
    popupKey: "hair",
    serviceId: "signature-cut",
    consultantId: "noah",
    bookingDate: "2026-03-01",
    bookingTime: "2:30 PM"
  });
  assert.equal(parsed.success, false);
});

test("update booking schema requires date/time for reschedule", () => {
  const parsed = updateBookingInputSchema.safeParse({
    action: "reschedule"
  });
  assert.equal(parsed.success, false);
});
