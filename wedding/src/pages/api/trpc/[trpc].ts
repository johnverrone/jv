import * as trpc from '@trpc/server';
import { TRPCError } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { findInvites } from '@utils/database';
import { z } from 'zod';

export const appRouter = trpc.router().query('invitations', {
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

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
