/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const firstGroupId = 1000;
  await prisma.group.upsert({
    where: {
      id: firstGroupId,
    },
    create: {
      id: firstGroupId,
    },
    update: {},
  });

  await prisma.person.upsert({
    where: {
      name: 'Test Data',
    },
    create: {
      name: 'Test Data',
      email: 'example@gmail.com',
      groupId: firstGroupId,
    },
    update: {},
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
