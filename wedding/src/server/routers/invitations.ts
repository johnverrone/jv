import { createRouter } from '../createRouter';
import { TRPCError } from '@trpc/server';
import { findInvites, updateInvite } from '@utils/database';
import { z } from 'zod';

export const invitationsRouter = createRouter()
  .query('find', {
    input: z.string(),
    async resolve({ input }) {
      const invitations = await findInvites(input);
      if (!invitations) {
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
        name: z.string(),
        attendance: z.union([
          z.literal('attending'),
          z.literal('not-attending'),
          z.literal('unknown'),
        ]),
      })
    ),
    async resolve({ input }) {
      for (const i of input) {
        await updateInvite(i.name, i.attendance);
      }
    },
  });
