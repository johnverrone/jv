import React, { FormEvent } from 'react';
import { useMachine } from '@xstate/react';
import { rsvpMachine } from '@xstate/rsvpMachine';
import { LookupForm } from './LookupForm';
import { Searching } from './Searching';
import { Submitting } from './Submitting';
import { Found } from './Found';
import { NotFound } from './NotFound';
import { Submitted } from './Submitted';
import { EditingForm } from './EditingForm';
import { RSVP } from '@utils/types';

export const RSVPForm = () => {
  const [state, send] = useMachine(rsvpMachine);

  const handleSubmit = (invitations: RSVP[]) => {
    send({ type: 'SUBMIT', invitations });
  };

  return state.matches('lookup') ? (
    <LookupForm
      search={state.context.search}
      onSubmit={(search) => send({ type: 'LOOKUP', search })}
    />
  ) : state.matches('searching') ? (
    <Searching />
  ) : state.matches('found') ? (
    <Found
      invitations={state.context.invitations}
      onChange={() => send('CHANGE_RESPONSE')}
    />
  ) : state.matches('notFound') ? (
    <NotFound
      onRetry={() => send('RETRY')}
      onStartOver={() => send('START_OVER')}
    />
  ) : state.matches('editing') ? (
    <EditingForm onSubmit={handleSubmit} />
  ) : state.matches('submitting') ? (
    <Submitting />
  ) : state.matches('submitted') ? (
    <Submitted onAck={() => send('ACK')} />
  ) : null;
};
