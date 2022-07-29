import { RSVP } from 'types/rsvp';
import { createMachine, assign } from 'xstate';

const getInvitation = async (name: string) => {
  const endpoint = `/api/invite/${name}`;
  const res = await fetch(endpoint);
  return res.json();
};

const submitRSVP = async (rsvp: RSVP) => {
  const endpoint = '/api/rsvp';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rsvp),
  };

  const response = await fetch(endpoint, options);
  return response.json();
};

interface RSVPContext extends RSVP {
  error: string | null;
}

export const rsvpMachine = createMachine<RSVPContext>({
  id: 'rsvp',
  initial: 'lookup',
  context: {
    name: '',
    email: '',
    attendance: 'unknown',
    error: null,
  },
  states: {
    lookup: {
      on: {
        CHANGE_NAME: {
          actions: assign({
            name: (_, event) => event.name,
          }),
        },
        LOOKUP: {
          target: 'searching',
          actions: assign({
            name: (_, event) => event.name,
          }),
        },
      },
    },
    searching: {
      invoke: {
        id: 'getInvitation',
        src: (context) => getInvitation(context.name),
        onDone: {
          target: 'found',
          actions: assign({
            name: (_, event) => event.data.name,
            email: (_, event) => event.data.email,
            attendance: (_, event) => event.data.attendance,
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
        CHANGE_NAME: {
          actions: assign({
            name: (_, event) => event.name,
          }),
        },
        CHANGE_EMAIL: {
          actions: assign({
            email: (_, event) => event.email,
          }),
        },
        CHANGE_ATTENDANCE: {
          actions: assign({
            attendance: (_, event) =>
              event.attending ? 'attending' : 'not-attending',
          }),
        },
        SUBMIT: 'submitting',
      },
    },
    submitting: {
      invoke: {
        id: 'submitResponse',
        src: (context) => submitRSVP(context),
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
