/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const firstPersonId = 1;
  const firstGroupId = 1000;

  await prisma.person.upsert({
    where: {
      id: firstPersonId,
    },
    create: {
      id: firstPersonId,
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
