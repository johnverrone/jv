import { Person } from '@prisma/client';
import { AppRouter } from '../server/routers/_app';
import { createTRPCClient } from '@trpc/client';
import { InferMutationInput, InferQueryInput } from '../utils/trpc';
import { createMachine, assign } from 'xstate';

const url = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/api/trpc`
  : 'http://localhost:3000/api/trpc';

const client = createTRPCClient<AppRouter>({
  url,
});

type FindInvitationRequest = InferQueryInput<'invitations.find'>;

const findInvitations = async (search: FindInvitationRequest) => {
  return client.query('invitations.find', search);
};

type InvitationUpdateRequest = InferMutationInput<'invitations.update'>;

const submitRSVPs = async (rsvps: InvitationUpdateRequest) => {
  return client.mutation('invitations.update', rsvps);
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
          actions: assign({ error: (_, event) => event.data }),
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
