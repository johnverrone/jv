import { differenceInCalendarDays } from 'date-fns';

export const getDaysRemaining = () => {
  const today = new Date();
  const wedding = new Date(2023, 7, 26);
  const daysRemaining = differenceInCalendarDays(wedding, today);

  return daysRemaining;
};
