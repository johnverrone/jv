import React, { ReactNode } from 'react';
import { Text } from '../Text';
import css from './Calendar.module.scss';

interface DayProps {
  label?: string;
  children?: ReactNode;
}

export const Day = ({ label, children }: DayProps) => {
  return (
    <div>
      <Text variant="heading3" className={css.dayLabel}>
        {label}
      </Text>
      <ol className={css.eventList}>{children}</ol>
    </div>
  );
};
