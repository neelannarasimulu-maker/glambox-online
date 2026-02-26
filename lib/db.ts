import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function ensureDatabaseEnv() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL. Set it in environment variables (Neon pooled URL).");
  }
}

export const prisma =
  global.prisma ||
  (() => {
    ensureDatabaseEnv();
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
    });
  })();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
