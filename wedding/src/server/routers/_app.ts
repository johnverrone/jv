import { router } from '../trpc';
import { invitationsRouter } from './invitations';

export const appRouter = router({
  invitations: invitationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
