import { z } from "zod";

const EMAIL_MAX_LENGTH = 254;
const NAME_MAX_LENGTH = 120;
const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_MAX_LENGTH = 128;

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please enter a valid email address.")
  .max(EMAIL_MAX_LENGTH, "Email is too long.");

export const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Full name is required.")
  .max(NAME_MAX_LENGTH, "Full name is too long.");

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
  .max(PASSWORD_MAX_LENGTH, "Password is too long.")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
  .regex(/[a-z]/, "Password must include at least one lowercase letter.")
  .regex(/[0-9]/, "Password must include at least one number.")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one special character.");
