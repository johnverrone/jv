import React from 'react';
import { differenceInCalendarDays } from 'date-fns';
import { Text } from '../Text';

export const Countdown = () => {
  const today = new Date();
  const wedding = new Date(2023, 7, 26);
  const daysRemaining = differenceInCalendarDays(wedding, today);
  return (
    <Text variant="body1">
      🎉 {daysRemaining} day{daysRemaining > 1 ? 's' : ''} remaining 🎉
    </Text>
  );
};
