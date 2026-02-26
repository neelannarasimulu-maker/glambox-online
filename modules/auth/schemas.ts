import { z } from "zod";
import { emailSchema, fullNameSchema, passwordSchema } from "@/lib/validation";

const optionalText = z.string().trim().max(500).optional();

export const loginInputSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Email and password are required.")
});

export const registerInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: fullNameSchema,
  phone: optionalText,
  dateOfBirth: optionalText,
  address: optionalText,
  city: optionalText,
  country: optionalText,
  bio: optionalText,
  preferences: optionalText,
  dislikes: optionalText,
  medicalInfo: optionalText,
  hairPreferences: optionalText,
  nailPreferences: optionalText,
  foodPreferences: optionalText,
  onboardingCompleted: z.boolean().optional()
});

export const profileUpdateInputSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().trim().optional(),
  phone: optionalText,
  dateOfBirth: optionalText,
  address: optionalText,
  city: optionalText,
  country: optionalText,
  bio: optionalText,
  preferences: optionalText,
  dislikes: optionalText,
  medicalInfo: optionalText,
  hairPreferences: optionalText,
  nailPreferences: optionalText,
  foodPreferences: optionalText,
  onboardingCompleted: z.boolean().optional()
});

export const passwordResetRequestInputSchema = z.object({
  email: emailSchema
});

export const passwordResetInputSchema = z.object({
  email: emailSchema,
  resetCode: z.string().trim().min(1, "Email, reset code, and new password are required."),
  password: passwordSchema
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateInputSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestInputSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetInputSchema>;
