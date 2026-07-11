// Client-safe coach vocabulary — shared by the admin UI and the server schema
// (src/lib/server/db/schema.ts re-exports these for server modules).

export const MODALITIES = [
	'lift',
	'run',
	'bike',
	'hiit',
	'hike',
	'walk',
	'mobility',
	'rest'
] as const;
export type Modality = (typeof MODALITIES)[number];

export const WORKOUT_STATUSES = ['done', 'skipped', 'modified'] as const;
export const WORKOUT_VARIANTS = ['full', 'bare_min'] as const;
export const CHECK_IN_TYPES = ['daily', 'weekly'] as const;

/** Indexed by Date#getDay: 0=Sunday..6=Saturday. */
export const DAY_NAMES = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday'
] as const;

/** Monday-first display order over the 0=Sunday..6=Saturday encoding. */
export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export const HABIT_LABELS = {
	noAddedSugar: 'no added sugar',
	noAlcohol: 'no alcohol',
	mobilityDone: 'mobility'
} as const;
