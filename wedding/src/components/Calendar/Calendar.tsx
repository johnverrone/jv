import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import css from './Calendar.module.scss';
import { CalendarEvent } from './CalendarEvent';
import { Text } from '../Text';
import type { WeddingEvent } from './types';

interface CalendarProps {
  events?: WeddingEvent[];
}

export function Calendar({ events }: CalendarProps) {
  const fridayEvents = events?.filter((e) => e.day === 'Friday') ?? [];
  const saturdayEvents = events?.filter((e) => e.day === 'Saturday') ?? [];
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
        <div className={css.eventLine} />
        <div className={css.dayName}>
          <Text variant="heading2">Friday</Text>
        </div>
        <div className={css.day}>
          {fridayEvents.map((e) => (
            <CalendarEvent
              key={e.id}
              event={e}
              open={openEventId === e.id}
              onClick={() => onClick(e.id)}
            />
          ))}
        </div>
        <div className={css.dayName}>
          <Text variant="heading2">Saturday</Text>
        </div>
        <div className={css.day}>
          {saturdayEvents.map((e) => (
            <CalendarEvent
              key={e.id}
              event={e}
              open={openEventId === e.id}
              onClick={() => onClick(e.id)}
            />
          ))}
        </div>
        <div className={css.dayName}>
          <Text variant="heading2">Sunday</Text>
        </div>
        <div className={css.day}></div>
      </div>
    </>
  );
}
