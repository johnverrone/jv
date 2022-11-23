import React from 'react';
import { Text } from '../Text';
import css from './YearSeparator.module.scss';

export const YearSeparator = ({ year }: { year: string }) => {
  return (
    <div className={css.container}>
      <Text variant="body1" bold tag="h2">
        {year}
      </Text>
    </div>
  );
};
