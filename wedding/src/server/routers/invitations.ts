import { createRouter } from '../createRouter';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

const defaultPersonSelect = Prisma.validator<Prisma.PersonSelect>()({
  id: true,
  name: true,
  email: true,
  attendance: true,
  golf: true,
  groupId: true,
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
      const invite = await prisma.person.findFirstOrThrow({
        where: {
          name: {
            contains: input,
            mode: 'insensitive',
          },
        },
        select: defaultPersonSelect,
      });
      const groupsInvitations = await prisma.person.findMany({
        where: {
          groupId: invite?.groupId,
        },
        select: defaultPersonSelect,
      });
      if (!invite) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Invite not found for ${input}`,
        });
      }
      return groupsInvitations;
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
        golf: z.union([
          z.literal('ATTENDING'),
          z.literal('NOT_ATTENDING'),
          z.literal('UNKNOWN'),
        ]),
      })
    ),
    async resolve({ input }) {
      for (const i of input) {
        const { id, attendance, golf } = i;
        await prisma.person.update({
          where: { id },
          data: { attendance, golf },
          select: defaultPersonSelect,
        });
      }
    },
  });
