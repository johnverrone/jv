import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import { router, publicProcedure } from '../trpc';

const defaultPersonSelect = Prisma.validator<Prisma.PersonSelect>()({
  id: true,
  name: true,
  email: true,
  attendance: true,
  shuttle: true,
  welcome: true,
  groupId: true,
  notes: true,
});

export const invitationsRouter = router({
  all: publicProcedure.query(() =>
    prisma.person.findMany({
      select: defaultPersonSelect,
    })
  ),
  find: publicProcedure.input(z.string()).query(async ({ input }) => {
    const trimmedInput = input.trim();
    const invites = await prisma.person.findMany({
      where: {
        name: {
          contains: trimmedInput,
          mode: 'insensitive',
        },
      },
      select: defaultPersonSelect,
    });

    if (!invites.length) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Invite not found for ${input}.`,
      });
    }

    const invite = invites[0];
    const foundGroup = invite.groupId;
    if (invites.some((i) => i.groupId !== foundGroup)) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Multiple invites found for ${input}. Try again with your full name.`,
      });
    }

    const groupsInvitations = await prisma.person.findMany({
      where: {
        groupId: invite.groupId,
      },
      select: defaultPersonSelect,
    });

    return groupsInvitations;
  }),
  update: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          attendance: z.union([
            z.literal('ATTENDING'),
            z.literal('NOT_ATTENDING'),
            z.literal('UNKNOWN'),
          ]),
          shuttle: z.union([
            z.literal('ATTENDING'),
            z.literal('NOT_ATTENDING'),
            z.literal('UNKNOWN'),
          ]),
          welcome: z.union([
            z.literal('ATTENDING'),
            z.literal('NOT_ATTENDING'),
            z.literal('UNKNOWN'),
          ]),
          notes: z.string().nullable(),
        })
      )
    )
    .mutation(async ({ input }) => {
      for (const i of input) {
        const { id, attendance, shuttle, welcome, notes } = i;
        await prisma.person.update({
          where: { id },
          data: { attendance, shuttle, welcome, notes },
          select: defaultPersonSelect,
        });
      }
    }),
});
