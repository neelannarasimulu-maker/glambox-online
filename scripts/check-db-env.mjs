const requiredKeys = ["DATABASE_URL", "DIRECT_DATABASE_URL"];

function fail(message) {
  console.error(`\n[db:check] ${message}\n`);
  process.exit(1);
}

function readValue(key) {
  const value = process.env[key];
  return typeof value === "string" ? value.trim() : "";
}

function looksLikePlaceholder(value) {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("user") ||
    normalized.includes("password") ||
    normalized.includes("ep-xxx") ||
    /\/db(\?|$)/i.test(value)
  );
}

function parseUrl(name, value) {
  try {
    const parsed = new URL(value);
    if (!["postgres:", "postgresql:"].includes(parsed.protocol)) {
      fail(`${name} must use postgres/postgresql protocol.`);
    }
    return parsed;
  } catch {
    fail(`${name} is not a valid PostgreSQL connection URL.`);
  }
}

for (const key of requiredKeys) {
  const value = readValue(key);
  if (!value) {
    fail(`Missing required env var ${key}.`);
  }
  if (looksLikePlaceholder(value)) {
    fail(`${key} still contains template placeholders. Replace it with your real Neon URL.`);
  }
}

const pooled = parseUrl("DATABASE_URL", readValue("DATABASE_URL"));
const direct = parseUrl("DIRECT_DATABASE_URL", readValue("DIRECT_DATABASE_URL"));

if (!pooled.hostname.includes("neon.tech") || !direct.hostname.includes("neon.tech")) {
  console.warn("[db:check] Warning: expected Neon hostnames (*.neon.tech).");
}

if (!pooled.hostname.includes("-pooler.")) {
  console.warn("[db:check] Warning: DATABASE_URL should usually be Neon pooled URL (host with '-pooler.').");
}

if (direct.hostname.includes("-pooler.")) {
  fail("DIRECT_DATABASE_URL must be Neon direct URL (non-pooler host).");
}

console.log("[db:check] Database env vars look valid.");
