import { AppRouter } from '@server/routers/_app';
import { createTRPCClient } from '@trpc/client';
import { RSVP } from '@utils/types';
import { createMachine, assign } from 'xstate';

const client = createTRPCClient<AppRouter>({
  url: 'http://localhost:3000/api/trpc',
});

const findInvitations = async (search: string) => {
  return client.query('invitations.find', search);
};

const submitRSVPs = async (rsvps: RSVP[]) => {
  return client.mutation('invitations.update', rsvps);
};

interface RSVPContext {
  search: string;
  error: string | null;
  invitations: RSVP[];
}

export const rsvpMachine = createMachine<RSVPContext>({
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
        ACK: 'found',
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
