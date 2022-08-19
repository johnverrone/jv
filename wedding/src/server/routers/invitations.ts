import { createRouter } from '../createRouter';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '@server/prisma';
import { Prisma } from '@prisma/client';

const defaultPersonSelect = Prisma.validator<Prisma.PersonSelect>()({
  id: true,
  name: true,
  email: true,
  attendance: true,
});

export const invitationsRouter = createRouter()
  .query('all', {
    async resolve() {
      return prisma.person.findMany({
        select: defaultPersonSelect,
      });
    },
  })
  .query('find', {
    input: z.string(),
    async resolve({ input }) {
      const invitations = await prisma.person.findMany({
        where: {
          name: {
            equals: input,
            mode: 'insensitive',
          },
        },
        select: defaultPersonSelect,
      });
      if (!invitations.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Invite not found for ${input}`,
        });
      }
      return invitations;
    },
  })
  .mutation('update', {
    input: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        attendance: z.union([
          z.literal('ATTENDING'),
          z.literal('NOT_ATTENDING'),
          z.literal('UNKNOWN'),
        ]),
      })
    ),
    async resolve({ input }) {
      for (const i of input) {
        const { id, attendance } = i;
        const person = prisma.person.update({
          where: { id },
          data: { attendance },
          select: defaultPersonSelect,
        });
        return person;
      }
    },
  });
