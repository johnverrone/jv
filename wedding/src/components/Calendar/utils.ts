import { ICalendarEvent } from './types';

// 320px to represent 16 times (8am => midnight)
// 8am => 0
// 10am => 40px
// 12pm => 80px
// 2pm => 120px
// 4pm => 160px
// 6pm => 200px
// 8pm => 240px
// 10pm => 280px
// midnight => 320px
//
// plus 10px to serve as padding (day is 340px tall)
export const position = (date: Date) => {
  const hours = date.getHours();
  return (hours - 8) * 20 + 10;
};

export const height = (startTime: Date, endTime: Date) => {
  const bottom = position(endTime);
  const top = position(startTime);
  const height = bottom < 0 ? 320 - top : bottom - top;
  return height;
};

export const getDayString = (date: Date) => {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
  });
};

export const getTimeString = (event: ICalendarEvent) => {
  return `${event.startTime.toLocaleTimeString(undefined, {
    timeStyle: 'short',
  })} - ${event.endTime.toLocaleTimeString(undefined, {
    timeStyle: 'short',
  })}`;
};
