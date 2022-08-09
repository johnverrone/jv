export type Attendance = 'attending' | 'not-attending' | 'unknown';

export interface RSVP {
  name: string;
  email: string;
  attendance: Attendance;
  host?: string;
}
