import { Person } from '@prisma/client';
import { AppRouter } from '../server/routers/_app';
import { createMachine, assign } from 'xstate';
import { inferRouterInputs } from '@trpc/server';
import { trpcClient } from '../utils/trpc';

type RouterInput = inferRouterInputs<AppRouter>;
type FindInvitationRequest = RouterInput['invitations']['find'];
type InvitationUpdateRequest = RouterInput['invitations']['update'];

const findInvitations = async (search: FindInvitationRequest) => {
  return trpcClient.invitations.find.query(search);
};

const submitRSVPs = async (rsvps: InvitationUpdateRequest) => {
  return trpcClient.invitations.update.mutate(rsvps);
};

interface RSVPContext {
  search: string;
  error: string | null;
  invitations: Person[];
}

export const rsvpMachine = createMachine<RSVPContext>({
  predictableActionArguments: true,
  id: 'rsvp',
  initial: 'lookup',
  context: {
    search: '',
    error: null,
    invitations: [],
  },
  states: {
    lookup: {
      on: {
        LOOKUP: {
          target: 'searching',
          actions: assign({
            search: (_, event) => event.search,
          }),
        },
      },
    },
    searching: {
      invoke: {
        id: 'findInvitations',
        src: (context) => findInvitations(context.search),
        onDone: {
          target: 'found',
          actions: assign({
            invitations: (_, event) => event.data,
          }),
        },
        onError: {
          target: 'notFound',
          actions: assign({
            error: (_, event) => event.data.message,
          }),
        },
      },
    },
    found: {
      on: {
        CHANGE_RESPONSE: 'editing',
        START_OVER: 'lookup',
      },
    },
    notFound: {
      on: {
        RETRY: 'searching',
        START_OVER: 'lookup',
      },
    },
    editing: {
      on: {
        START_OVER: 'lookup',
        SUBMIT: {
          target: 'submitting',
          actions: assign({
            invitations: (_, event) => event.invitations,
          }),
        },
      },
    },
    submitting: {
      invoke: {
        id: 'submitResponse',
        src: (context) => submitRSVPs(context.invitations),
        onDone: {
          target: 'submitted',
        },
        onError: {
          target: 'errorSubmitting',
        },
      },
    },
    submitted: {
      on: {
        ACK: 'lookup',
      },
    },
    errorSubmitting: {
      on: {
        RETRY: 'submitting',
        BACK: 'editing',
      },
    },
  },
});
