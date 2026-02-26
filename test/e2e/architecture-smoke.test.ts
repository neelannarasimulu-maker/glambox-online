import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function read(relPath: string) {
  return readFileSync(join(ROOT, relPath), "utf8");
}

test("auth routes delegate to modules/auth service layer", () => {
  const loginRoute = read("app/api/auth/login/route.ts");
  const registerRoute = read("app/api/auth/register/route.ts");
  const profileRoute = read("app/api/auth/profile/route.ts");

  assert.match(loginRoute, /modules\/auth\/service/);
  assert.match(registerRoute, /modules\/auth\/service/);
  assert.match(profileRoute, /modules\/auth\/service/);
});

test("booking routes delegate to modules/bookings service layer", () => {
  const bookingsRoute = read("app/api/bookings/route.ts");
  const bookingByIdRoute = read("app/api/bookings/[id]/route.ts");

  assert.match(bookingsRoute, /modules\/bookings\/service/);
  assert.match(bookingByIdRoute, /modules\/bookings\/service/);
});

test("security headers include CSP", () => {
  const nextConfig = read("next.config.mjs");
  assert.match(nextConfig, /Content-Security-Policy/);
});
