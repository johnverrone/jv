export interface WeddingEvent {
  id: string;
  name: string;
  shortName: string;
  location: string;
  description?: string;
  day: 'friday' | 'saturday' | 'sunday';
  startTime: Date;
  endTime: Date;
}
