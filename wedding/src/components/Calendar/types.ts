export interface WeddingEvent {
  id: string;
  name: string;
  location: string;
  locationUrl?: string;
  description?: string;
  day: 'Friday' | 'Saturday' | 'Sunday';
  startTime: Date;
  endTime: Date;
  emoji?: string;
}
