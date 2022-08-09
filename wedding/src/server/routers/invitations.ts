import { createRouter } from '../createRouter';
import { TRPCError } from '@trpc/server';
import { findInvites } from '@utils/database';
import { z } from 'zod';

export const invitationsRouter = createRouter().query('find', {
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
});
