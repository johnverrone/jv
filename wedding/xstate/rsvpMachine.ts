import { createMachine, assign } from 'xstate';

interface RSVPContext {
  name: string;
  email: string;
  attending: boolean | null;
}

export const rsvpMachine = createMachine<RSVPContext>({
  id: 'rsvp',
  initial: 'editing',
  context: {
    name: '',
    email: '',
    attending: null,
  },
  states: {
    attending: {
      on: {
        EDIT: 'editing',
      },
    },
    notAttending: {
      on: {
        EDIT: 'editing',
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
            attending: (_, event) => event.attending,
          }),
        },
        SAY_YES: 'attending',
        SAY_NO: 'notAttending',
      },
    },
  },
});
