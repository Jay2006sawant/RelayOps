import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.DEMO_USER_EMAIL ?? "demo@relayops.dev";
  const password = process.env.DEMO_USER_PASSWORD ?? "RelayOps2026!";
  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: "Demo Operator" },
    create: { email, name: "Demo Operator", passwordHash },
  });

  console.log(`Seeded demo user: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
