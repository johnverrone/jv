import { Text } from '../../components/Text';
import React from 'react';
import css from './index.module.scss';
import { Button } from '../../components/Button';

interface NotFoundProps {
  onRetry: () => void;
  onStartOver: () => void;
  errorMessage: string;
}

export const NotFound = ({
  onRetry,
  onStartOver,
  errorMessage,
}: NotFoundProps) => (
  <div className={css.rsvpForm}>
    <div>
      <Text variant="heading1">Uh oh!</Text>
      <Text variant="body2">{errorMessage}</Text>
    </div>
    <div className={css.rowItems}>
      <Button onClick={onStartOver}>Search again</Button>
      <Button onClick={onRetry}>Retry</Button>
    </div>
  </div>
);
