import React from 'react';
import { Text } from '../Text';
import css from './Calendar.module.scss';
import { ICalendarEvent } from './types';
import Link from 'next/link';

interface CalendarEvenProps extends ICalendarEvent {}

export const CalendarEvent = ({
  attire,
  description,
  location,
  locationUrl,
  name,
  time,
}: CalendarEvenProps) => {
  return (
    <li>
      <Text variant="heading2" className={css.eventTitle}>
        {name}
      </Text>
      <div className={css.metadata}>
        <div className={css.iconRow}>
          <i className="las la-calendar la-lg"></i>
          <Text variant="body2" tag="p">
            {time}
          </Text>
        </div>
        <div className={css.iconRow}>
          <i className="las la-map-marker la-lg"></i>
          <Text variant="body2" tag="p">
            {locationUrl ? (
              <Link href={locationUrl} target="_blank" className="link">
                {location}
              </Link>
            ) : (
              location
            )}
          </Text>
        </div>
        <div className={css.iconRow}>
          <i className="las la-tshirt la-lg"></i>
          <Text variant="body2">{attire}</Text>
        </div>
      </div>
      <Text variant="body2" tag="p">
        {description}
      </Text>
    </li>
  );
};
