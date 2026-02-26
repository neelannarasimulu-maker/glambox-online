import test from "node:test";
import assert from "node:assert/strict";
import { loginInputSchema, passwordResetInputSchema, registerInputSchema } from "@/modules/auth/schemas";

test("register schema accepts valid payload", () => {
  const parsed = registerInputSchema.safeParse({
    email: "user@example.com",
    password: "StrongPass!123",
    fullName: "Test User"
  });
  assert.equal(parsed.success, true);
});

test("register schema rejects weak password", () => {
  const parsed = registerInputSchema.safeParse({
    email: "user@example.com",
    password: "weak",
    fullName: "Test User"
  });
  assert.equal(parsed.success, false);
});

test("login schema requires email and password", () => {
  const parsed = loginInputSchema.safeParse({
    email: "user@example.com",
    password: "abc"
  });
  assert.equal(parsed.success, true);
});

test("password reset schema requires reset code", () => {
  const parsed = passwordResetInputSchema.safeParse({
    email: "user@example.com",
    password: "StrongPass!123",
    resetCode: ""
  });
  assert.equal(parsed.success, false);
});
