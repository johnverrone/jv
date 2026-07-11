import type { DB } from '../db';
import { workoutLog } from '../db/schema';
import type { Modality } from '../../coach/types';
import { getOAuthToken, saveOAuthToken, markSynced } from '../db/integrations';
import { getSessionsForDay, getWorkoutsForDate, deleteWorkoutLog } from '../db/coach';
import { dayOfWeek } from '../date';

export interface OAuthCreds {
	clientId: string;
	clientSecret: string;
}

/** The subset of a Strava activity the import cares about. */
export interface StravaActivity {
	id: number;
	name?: string;
	sport_type: string;
	start_date_local: string; // ISO in the athlete's local time
	moving_time: number; // seconds
}

const SPORT_TO_MODALITY: Record<string, Modality> = {
	Run: 'run',
	TrailRun: 'run',
	VirtualRun: 'run',
	Ride: 'bike',
	VirtualRide: 'bike',
	GravelRide: 'bike',
	MountainBikeRide: 'bike',
	EBikeRide: 'bike',
	Hike: 'hike',
	Walk: 'walk',
	Snowshoe: 'hike',
	WeightTraining: 'lift',
	Crossfit: 'hiit',
	HighIntensityIntervalTraining: 'hiit',
	Workout: 'hiit',
	Yoga: 'mobility',
	Pilates: 'mobility'
};

export function mapSportType(sportType: string): Modality | null {
	return SPORT_TO_MODALITY[sportType] ?? null;
}

export interface ImportResult {
	imported: number;
	duplicates: number;
	replaced: number;
	unmapped: string[];
}

/**
 * Turn fetched activities into workout_log rows. Pure of the network, so the
 * matching rules are testable:
 * - `strava_activity_id` UNIQUE dedupes re-syncs (insert-or-ignore);
 * - an existing manual/api log for the same date+modality (e.g. tapped Done on
 *   the Today page) means the activity is a duplicate, not a second workout;
 * - a whoop-sourced log for the same date+modality is REPLACED — when both
 *   providers saw the workout, Strava's version (GPS, real moving time) wins
 *   regardless of which sync ran first;
 * - the day's plan session with the same modality gets linked for adherence.
 */
export async function importStravaActivities(
	db: DB,
	activities: StravaActivity[]
): Promise<ImportResult> {
	const result: ImportResult = { imported: 0, duplicates: 0, replaced: 0, unmapped: [] };

	for (const activity of activities) {
		const modality = mapSportType(activity.sport_type);
		if (!modality) {
			if (!result.unmapped.includes(activity.sport_type)) result.unmapped.push(activity.sport_type);
			continue;
		}

		const date = activity.start_date_local.slice(0, 10);
		const existing = await getWorkoutsForDate(db, date);
		const sameModality = existing.filter(
			(w) => w.modality === modality && w.stravaActivityId !== String(activity.id)
		);
		if (sameModality.some((w) => w.source !== 'whoop')) {
			result.duplicates++;
			continue;
		}
		for (const whoopDup of sameModality) {
			await deleteWorkoutLog(db, whoopDup.id);
			result.replaced++;
		}

		const sessions = await getSessionsForDay(db, dayOfWeek(date));
		const planned = sessions.find((s) => s.modality === modality);

		const inserted = await db
			.insert(workoutLog)
			.values({
				date,
				planSessionId: planned?.id ?? null,
				status: 'done',
				variant: 'full',
				modality,
				durationMin: Math.round(activity.moving_time / 60),
				notes: activity.name ?? null,
				source: 'strava',
				stravaActivityId: String(activity.id)
			})
			.onConflictDoNothing({ target: workoutLog.stravaActivityId })
			.returning();

		if (inserted.length) result.imported++;
		else result.duplicates++;
	}

	return result;
}

/** Valid access token, refreshing (and persisting the rotated pair) when close to expiry. */
export async function freshStravaToken(db: DB, creds: OAuthCreds): Promise<string> {
	const token = await getOAuthToken(db, 'strava');
	if (!token) throw new Error('Strava is not connected');
	if (token.expiresAt > Date.now() / 1000 + 300) return token.accessToken;

	const res = await fetch('https://www.strava.com/oauth/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: creds.clientId,
			client_secret: creds.clientSecret,
			grant_type: 'refresh_token',
			refresh_token: token.refreshToken
		})
	});
	if (!res.ok) throw new Error(`Strava token refresh failed (${res.status})`);
	const data = (await res.json()) as {
		access_token: string;
		refresh_token: string;
		expires_at: number;
	};
	await saveOAuthToken(db, {
		provider: 'strava',
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		expiresAt: data.expires_at,
		athleteId: token.athleteId,
		scopes: token.scopes
	});
	return data.access_token;
}

async function fetchStravaActivities(
	accessToken: string,
	afterEpoch: number
): Promise<StravaActivity[]> {
	const activities: StravaActivity[] = [];
	for (let page = 1; page <= 3; page++) {
		const params = new URLSearchParams({
			after: String(afterEpoch),
			per_page: '100',
			page: String(page)
		});
		const res = await fetch(`https://www.strava.com/api/v3/athlete/activities?${params}`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		if (!res.ok) throw new Error(`Strava activities fetch failed (${res.status})`);
		const batch = (await res.json()) as StravaActivity[];
		activities.push(...batch);
		if (batch.length < 100) break;
	}
	return activities;
}

/** Pull the last `days` of activities and import them. */
export async function syncStrava(db: DB, creds: OAuthCreds, days = 14): Promise<ImportResult> {
	const accessToken = await freshStravaToken(db, creds);
	const after = Math.floor(Date.now() / 1000) - days * 86400;
	const activities = await fetchStravaActivities(accessToken, after);
	const result = await importStravaActivities(db, activities);
	await markSynced(db, 'strava');
	return result;
}
