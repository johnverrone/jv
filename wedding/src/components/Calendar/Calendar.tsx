import React, { ReactNode } from 'react';
import css from './Calendar.module.scss';

interface CalendarProps {
  children?: ReactNode;
}

export const Calendar = ({ children }: CalendarProps) => {
  return <section className={css.calendar}>{children}</section>;
};
