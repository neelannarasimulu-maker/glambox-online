import { z } from "zod";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const createBookingInputSchema = z.object({
  popupKey: z.string().trim().min(1, "popupKey is required."),
  serviceId: z.string().trim().min(1, "serviceId is required."),
  consultantId: z.string().trim().min(1, "consultantId is required."),
  bookingDate: z.string().trim().regex(DATE_REGEX, "bookingDate must be in YYYY-MM-DD format."),
  bookingTime: z.string().trim().regex(TIME_REGEX, "bookingTime must be in HH:MM 24-hour format."),
  notes: z.string().trim().max(2000).optional(),
  source: z.string().trim().max(80).optional()
});

export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;

export const updateBookingInputSchema = z
  .object({
    action: z.enum(["reschedule", "cancel"]),
    bookingDate: z
      .string()
      .trim()
      .regex(DATE_REGEX, "bookingDate must be in YYYY-MM-DD format.")
      .optional(),
    bookingTime: z
      .string()
      .trim()
      .regex(TIME_REGEX, "bookingTime must be in HH:MM 24-hour format.")
      .optional(),
    reason: z.string().trim().max(500).optional()
  })
  .superRefine((value, ctx) => {
    if (value.action === "reschedule") {
      if (!value.bookingDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bookingDate"],
          message: "bookingDate is required for reschedule."
        });
      }
      if (!value.bookingTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bookingTime"],
          message: "bookingTime is required for reschedule."
        });
      }
    }
  });

export type UpdateBookingInput = z.infer<typeof updateBookingInputSchema>;
