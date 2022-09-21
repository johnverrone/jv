import { Text } from '../Text';
import React from 'react';
import css from '../../styles/rsvp.module.css';
import { Button } from '../Button';

interface NotFoundProps {
  onRetry: () => void;
  onStartOver: () => void;
}

export const NotFound = ({ onRetry, onStartOver }: NotFoundProps) => (
  <div className={css.rsvpForm}>
    <Text variant="heading3">
      Uh oh! There was an error finding your invite.
    </Text>
    <div className={css.rowItems}>
      <Button onClick={onStartOver}>Search again</Button>
      <Button onClick={onRetry}>Retry</Button>
    </div>
  </div>
);
