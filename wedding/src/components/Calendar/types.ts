import { ReactNode } from 'react';

export interface IWeddingEvent {
  id: string;
  name: string;
  location: string;
  locationUrl?: string;
  description?: ReactNode;
  startTime: Date;
  endTime: Date;
  attire?: string;
  type: 'wedding';
}

export interface IFreeSpace {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  type: 'free';
}

export type ICalendarEvent = IWeddingEvent | IFreeSpace;
