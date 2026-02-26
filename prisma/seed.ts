import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@glambox.local";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return;
  }

  const now = new Date();
  const userId = randomUUID();

  await prisma.user.create({
    data: {
      id: userId,
      email,
      passwordHash: await bcrypt.hash("DemoPass123!", 10),
      fullName: "Demo User",
      authProvider: "email",
      onboardingCompleted: true,
      createdAt: now,
      updatedAt: now
    }
  });

  await prisma.booking.create({
    data: {
      id: randomUUID(),
      userId,
      popupKey: "hair",
      popupName: "Hair Studio",
      serviceId: "service-cut",
      serviceTitle: "Precision Haircut",
      consultantId: "consultant-alex",
      consultantName: "Alex",
      bookingDate: now.toISOString().slice(0, 10),
      bookingTime: "14:30",
      status: "confirmed",
      source: "seed",
      createdAt: now,
      updatedAt: now
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
