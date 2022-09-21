import React from 'react';
import css from '@styles/rsvp.module.css';
import { Button } from '../Button';

interface SubmittedProps {
  onAck: () => void;
}

export const Submitted = ({ onAck }: SubmittedProps) => (
  <div className={css.rsvpForm}>
    <p>Response received, thanks!</p>
    <Button onClick={onAck} className={css.submitButton}>
      👍
    </Button>
  </div>
);
