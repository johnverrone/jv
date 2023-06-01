'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import css from './Calendar.module.scss';
import { CalendarEvent } from './CalendarEvent';
import { Text } from '../Text';
import type { ICalendarEvent } from './types';
import { FreeSpace } from './FreeSpace';
import { isFriday, isSaturday, isThursday } from 'date-fns';

interface CalendarProps {
  events?: ICalendarEvent[];
}

export function Calendar({ events }: CalendarProps) {
  const thursdayEvents = events?.filter((e) => isThursday(e.startTime)) ?? [];
  const fridayEvents = events?.filter((e) => isFriday(e.startTime)) ?? [];
  const saturdayEvents = events?.filter((e) => isSaturday(e.startTime)) ?? [];
  const [openEventId, setOpenEventId] = useState<string | null>(null);

  const onClick = (id: string) => {
    setOpenEventId((openEvent) => {
      if (openEvent === id) return null;
      return id;
    });
  };

  useEffect(() => {
    const listener = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenEventId(null);
      }
    };
    window.addEventListener('keydown', listener);

    return () => window.removeEventListener('keydown', listener);
  });

  const renderDay = (events: ICalendarEvent[]): (JSX.Element | null)[] =>
    events.map((e) =>
      e.type === 'wedding' ? (
        <CalendarEvent
          key={e.id}
          event={e}
          open={openEventId === e.id}
          onClick={() => onClick(e.id)}
        />
      ) : e.type === 'free' ? (
        <FreeSpace event={e} />
      ) : null
    );

  return (
    <>
      <AnimatePresence>
        {openEventId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={css.overlay}
            onClick={() => setOpenEventId(null)}
          />
        )}
      </AnimatePresence>
      <div id="calendar" className={css.calendar}>
        {/* <div className={css.dayName}>
          <Text variant="heading3">Thursday</Text>
        </div>
        <div className={css.day}>{renderDay(thursdayEvents)}</div> */}
        <div className={css.dayName}>
          <Text variant="heading3">Friday</Text>
        </div>
        <div className={css.day}>{renderDay(fridayEvents)}</div>
        <div className={css.dayName}>
          <Text variant="heading3">Saturday</Text>
        </div>
        <div className={css.day}>{renderDay(saturdayEvents)}</div>
        <div className={css.dayName}>
          <Text variant="heading3">Sunday</Text>
        </div>
        <div className={css.day} />
      </div>
    </>
  );
}
