import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import css from './Calendar.module.scss';
import { CalendarEvent } from './CalendarEvent';
import type { WeddingEvent } from './types';

interface CalendarProps {
  events?: WeddingEvent[];
}

export function Calendar({ events }: CalendarProps) {
  const fridayEvents = events?.filter((e) => e.day === 'friday') ?? [];
  const saturdayEvents = events?.filter((e) => e.day === 'saturday') ?? [];
  const [openEventId, setOpenEventId] = useState<string | null>(null);

  const onClick = (id: string) => {
    setOpenEventId((openEvent) => {
      if (openEvent === id) return null;
      return id;
    });
  };

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
        <h2 className={css.dayName}>Friday</h2>
        <div className={css.day}>
          <div className={css.hourLines}>
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
          </div>
          {fridayEvents.map((e) => (
            <CalendarEvent
              key={e.id}
              event={e}
              open={openEventId === e.id}
              onClick={() => onClick(e.id)}
            />
          ))}
        </div>
        <h2 className={css.dayName}>Saturday</h2>
        <div className={css.day}>
          <div className={css.hourLines}>
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
          </div>
          {saturdayEvents.map((e) => (
            <CalendarEvent
              key={e.id}
              event={e}
              open={openEventId === e.id}
              onClick={() => onClick(e.id)}
            />
          ))}
        </div>
        <h2 className={css.dayName}>Sunday</h2>
        <div className={css.day}>
          <div className={css.hourLines}>
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
            <div className={css.hourLine} />
          </div>
        </div>
        <div className={css.eventLine} />
      </div>
    </>
  );
}
