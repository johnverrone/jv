/**
 * Coach dates are local days in America/Chicago, stored as ISO yyyy-mm-dd text.
 * Workers run in UTC, so "today" must always be computed through this module.
 */
export const COACH_TIMEZONE = 'America/Chicago';

/** Today's local date as yyyy-mm-dd (en-CA locale formats exactly that). */
export function todayCentral(): string {
	return new Intl.DateTimeFormat('en-CA', { timeZone: COACH_TIMEZONE }).format(new Date());
}

/** Day of week for a yyyy-mm-dd string, 0=Sunday..6=Saturday (Date#getDay encoding). */
export function dayOfWeek(isoDate: string): number {
	// Noon UTC keeps the calendar date stable regardless of host timezone.
	return new Date(`${isoDate}T12:00:00Z`).getUTCDay();
}

export function addDays(isoDate: string, n: number): string {
	const d = new Date(`${isoDate}T12:00:00Z`);
	d.setUTCDate(d.getUTCDate() + n);
	return d.toISOString().slice(0, 10);
}

/** Monday of the week containing `isoDate` (weeks display Monday-first). */
export function weekStart(isoDate: string): string {
	const dow = dayOfWeek(isoDate);
	return addDays(isoDate, dow === 0 ? -6 : 1 - dow);
}
