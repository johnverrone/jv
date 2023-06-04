import { ReactNode } from 'react';

export interface ICalendarEvent {
  attire: string;
  description?: ReactNode;
  location: string;
  locationUrl?: string;
  name: string;
  time: string;
}
