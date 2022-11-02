import React from 'react';
import css from './index.module.scss';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import Link from 'next/link';

interface SubmittedProps {
  onAck: () => void;
}

export const Submitted = ({ onAck }: SubmittedProps) => (
  <div className={css.rsvpForm}>
    <Text variant="body1">Response received, thanks!</Text>
    <Link href="/weekend" className={css.submitButton}>
      <Button>See the Schedule</Button>
    </Link>
  </div>
);
