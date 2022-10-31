export interface WeddingEvent {
  id: string;
  name: string;
  shortName: string;
  location: string;
  description?: string;
  day: 'Friday' | 'Saturday' | 'Sunday';
  startTime: Date;
  endTime: Date;
}
