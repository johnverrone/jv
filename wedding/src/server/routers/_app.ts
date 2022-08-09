import { createRouter } from '../createRouter';
import { invitationsRouter } from './invitations';

export const appRouter = createRouter().merge(
  'invitations.',
  invitationsRouter
);

// export type definition of API
export type AppRouter = typeof appRouter;
