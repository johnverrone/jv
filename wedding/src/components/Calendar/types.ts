export interface WeddingEvent {
  id: string;
  name: string;
  location: string;
  description?: string;
  day: 'Friday' | 'Saturday' | 'Sunday';
  startTime: Date;
  endTime: Date;
  emoji?: string;
}
