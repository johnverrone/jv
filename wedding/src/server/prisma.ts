import { PrismaClient } from '@prisma/client';

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export let prisma: PrismaClient;

if (process.env.TEASER_MODE == '0') {
  if (process.env.NODE_ENV === 'production') {
    new PrismaClient();
  } else {
    if (!prismaGlobal.prisma) {
      prismaGlobal.prisma = new PrismaClient();
    }
    global = prismaGlobal;
  }
}
