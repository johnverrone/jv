import type { DB } from '../db';
import { workoutLog } from '../db/schema';
import type { Modality } from '../../coach/types';
import { addMetric, getSessionsForDay, getWorkoutsForDate } from '../db/coach';
import { getOAuthToken, saveOAuthToken, markSynced } from '../db/integrations';
import { dayOfWeek } from '../date';
import type { OAuthCreds, ImportResult } from './strava';

export const WHOOP_API_BASE = 'https://api.prod.whoop.com/developer';
export const WHOOP_TOKEN_URL = 'https://api.prod.whoop.com/oauth/oauth2/token';
export const WHOOP_AUTH_URL = 'https://api.prod.whoop.com/oauth/oauth2/auth';
// Every scope here must also be enabled on the app in the Whoop dev dashboard,
// and a token only carries the scopes granted when it was authorized — adding
// a scope means disconnecting and reconnecting Whoop on the sync page.
export const WHOOP_SCOPES =
	'offline read:recovery read:cycles read:sleep read:workout read:profile';

// The subsets of Whoop v2 records the import cares about. Whoop's public API
// exposes recovery/strain/HR/HRV/sleep — the Stress Monitor score is not
// available to third parties.

export interface WhoopCycle {
	id: number;
	start: string; // UTC ISO
	timezone_offset: string; // e.g. "-05:00"
	score_state: string;
	score?: { strain: number; average_heart_rate: number; max_heart_rate: number };
}

export interface WhoopRecovery {
	cycle_id: number;
	created_at: string;
	score_state: string;
	score?: {
		recovery_score: number;
		resting_heart_rate: number;
		hrv_rmssd_milli: number;
		user_calibrating: boolean;
	};
}

export interface WhoopSleep {
	id: string;
	end: string; // UTC ISO — the morning the sleep counts toward
	timezone_offset: string;
	nap: boolean;
	score_state: string;
	score?: { sleep_performance_percentage: number };
}

/** Local calendar date for a UTC instant given Whoop's "+HH:MM"/"-HH:MM" offset. */
export function whoopLocalDate(utcIso: string, offset: string): string {
	const match = /^([+-])(\d{2}):(\d{2})/.exec(offset);
	const minutes = match
		? (match[1] === '-' ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3]))
		: 0;
	return new Date(new Date(utcIso).getTime() + minutes * 60_000).toISOString().slice(0, 10);
}

export interface WhoopWorkout {
	id: string; // v2 UUID
	start: string; // UTC ISO
	end: string;
	timezone_offset: string;
	sport_name: string; // e.g. "weightlifting", "walking"
	score_state: string;
	score?: { strain: number; average_heart_rate: number };
}

export interface WhoopData {
	cycles: WhoopCycle[];
	recoveries: WhoopRecovery[];
	sleeps: WhoopSleep[];
	workouts: WhoopWorkout[];
}

export interface WhoopImportResult {
	days: number;
	metrics: number;
	workouts: ImportResult;
}

// Whoop sport names → modality. Names are normalized (lowercase, spaces/-/→_).
const WHOOP_SPORT_TO_MODALITY: Record<string, Modality> = {
	running: 'run',
	trail_running: 'run',
	weightlifting: 'lift',
	powerlifting: 'lift',
	functional_fitness: 'hiit',
	hiit: 'hiit',
	circuit_training: 'hiit',
	cycling: 'bike',
	spinning: 'bike',
	mountain_biking: 'bike',
	walking: 'walk',
	stroller_walking: 'walk',
	hiking: 'hike',
	rucking: 'hike',
	hiking_rucking: 'hike',
	yoga: 'mobility',
	pilates: 'mobility',
	stretching: 'mobility'
};

// Deliberately not coached — skipped silently rather than reported as unmapped.
const WHOOP_SPORT_IGNORED = new Set(['activity', 'golf']);

function normalizeWhoopSport(sportName: string): string {
	// Whoop reports strength sports tracked with the musculoskeletal (strength
	// trainer) feature as e.g. "weightlifting_msk" — same sport, so map both.
	return sportName
		.toLowerCase()
		.replace(/[\s/-]+/g, '_')
		.replace(/_msk$/, '');
}

export function mapWhoopSport(sportName: string): Modality | null {
	return WHOOP_SPORT_TO_MODALITY[normalizeWhoopSport(sportName)] ?? null;
}

export function isIgnoredWhoopSport(sportName: string): boolean {
	return WHOOP_SPORT_IGNORED.has(normalizeWhoopSport(sportName));
}

/**
 * Whoop-logged workouts (walks, lifts) → workout_log rows. Same matching rules
 * as the Strava import, except Whoop is the LOWER-priority source: any existing
 * log for the date+modality — manual, api, or Strava — makes it a duplicate.
 * (The Strava import replaces whoop-sourced rows, so sync order never matters.)
 */
export async function importWhoopWorkouts(db: DB, workouts: WhoopWorkout[]): Promise<ImportResult> {
	const result: ImportResult = { imported: 0, duplicates: 0, replaced: 0, unmapped: [] };

	for (const workout of workouts) {
		const modality = mapWhoopSport(workout.sport_name);
		if (!modality) {
			if (!isIgnoredWhoopSport(workout.sport_name) && !result.unmapped.includes(workout.sport_name)) {
				result.unmapped.push(workout.sport_name);
			}
			continue;
		}

		const date = whoopLocalDate(workout.start, workout.timezone_offset);
		const existing = await getWorkoutsForDate(db, date);
		if (existing.some((w) => w.modality === modality && w.whoopWorkoutId !== workout.id)) {
			result.duplicates++;
			continue;
		}

		const sessions = await getSessionsForDay(db, dayOfWeek(date));
		const planned = sessions.find((s) => s.modality === modality);
		const durationMin = Math.max(
			1,
			Math.round((new Date(workout.end).getTime() - new Date(workout.start).getTime()) / 60_000)
		);

		const inserted = await db
			.insert(workoutLog)
			.values({
				date,
				planSessionId: planned?.id ?? null,
				status: 'done',
				variant: 'full',
				modality,
				durationMin,
				notes: `whoop: ${workout.sport_name}${workout.score ? ` · strain ${Math.round(workout.score.strain * 10) / 10}` : ''}`,
				source: 'whoop',
				whoopWorkoutId: workout.id
			})
			.onConflictDoNothing({ target: workoutLog.whoopWorkoutId })
			.returning();

		if (inserted.length) result.imported++;
		else result.duplicates++;
	}

	return result;
}

/**
 * Fold Whoop records into body_metric rows (upsert on date+type), one value
 * per day: whoop_strain, whoop_recovery, resting_hr, hrv_ms, sleep_perf.
 * Pure of the network so the date/score plumbing is testable.
 */
export async function applyWhoopData(db: DB, data: WhoopData): Promise<WhoopImportResult> {
	const dates = new Set<string>();
	let metrics = 0;
	const workouts = await importWhoopWorkouts(db, data.workouts);

	const put = async (date: string, type: string, value: number) => {
		await addMetric(db, { date, type, value });
		dates.add(date);
		metrics++;
	};

	const cycleDates = new Map<number, string>();
	for (const cycle of data.cycles) {
		const date = whoopLocalDate(cycle.start, cycle.timezone_offset);
		cycleDates.set(cycle.id, date);
		if (cycle.score_state === 'SCORED' && cycle.score) {
			await put(date, 'whoop_strain', Math.round(cycle.score.strain * 10) / 10);
		}
	}

	for (const recovery of data.recoveries) {
		if (recovery.score_state !== 'SCORED' || !recovery.score) continue;
		const date = cycleDates.get(recovery.cycle_id) ?? recovery.created_at.slice(0, 10);
		await put(date, 'whoop_recovery', recovery.score.recovery_score);
		await put(date, 'resting_hr', recovery.score.resting_heart_rate);
		await put(date, 'hrv_ms', Math.round(recovery.score.hrv_rmssd_milli * 10) / 10);
	}

	for (const sleep of data.sleeps) {
		if (sleep.nap || sleep.score_state !== 'SCORED' || !sleep.score) continue;
		const date = whoopLocalDate(sleep.end, sleep.timezone_offset);
		await put(date, 'sleep_perf', sleep.score.sleep_performance_percentage);
	}

	return { days: dates.size, metrics, workouts };
}

/** Valid access token, refreshing (and persisting the rotated pair) when close to expiry. */
export async function freshWhoopToken(db: DB, creds: OAuthCreds): Promise<string> {
	const token = await getOAuthToken(db, 'whoop');
	if (!token) throw new Error('Whoop is not connected');
	if (token.expiresAt > Date.now() / 1000 + 300) return token.accessToken;

	const res = await fetch(WHOOP_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: creds.clientId,
			client_secret: creds.clientSecret,
			grant_type: 'refresh_token',
			refresh_token: token.refreshToken,
			scope: 'offline'
		})
	});
	if (!res.ok) throw new Error(`Whoop token refresh failed (${res.status})`);
	const data = (await res.json()) as {
		access_token: string;
		refresh_token: string;
		expires_in: number;
	};
	await saveOAuthToken(db, {
		provider: 'whoop',
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
		athleteId: token.athleteId,
		scopes: token.scopes
	});
	return data.access_token;
}

/** Page through a Whoop v2 collection endpoint (limit 25/page). */
async function fetchWhoopCollection<T>(
	accessToken: string,
	path: string,
	startIso: string
): Promise<T[]> {
	const records: T[] = [];
	let nextToken: string | undefined;
	for (let page = 0; page < 10; page++) {
		const params = new URLSearchParams({ start: startIso, limit: '25' });
		if (nextToken) params.set('nextToken', nextToken);
		const res = await fetch(`${WHOOP_API_BASE}${path}?${params}`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		if (!res.ok) {
			const detail = res.status === 401 ? ' — missing scope? Disconnect and reconnect Whoop' : '';
			throw new Error(`Whoop ${path} fetch failed (${res.status})${detail}`);
		}
		const body = (await res.json()) as { records: T[]; next_token?: string };
		records.push(...body.records);
		nextToken = body.next_token ?? undefined;
		if (!nextToken) break;
	}
	return records;
}

/** Pull the last `days` of recovery/strain/sleep and fold them into metrics. */
export async function syncWhoop(db: DB, creds: OAuthCreds, days = 14): Promise<WhoopImportResult> {
	const accessToken = await freshWhoopToken(db, creds);
	const startIso = new Date(Date.now() - days * 86_400_000).toISOString();

	const [cycles, recoveries, sleeps, workouts] = await Promise.all([
		fetchWhoopCollection<WhoopCycle>(accessToken, '/v2/cycle', startIso),
		fetchWhoopCollection<WhoopRecovery>(accessToken, '/v2/recovery', startIso),
		fetchWhoopCollection<WhoopSleep>(accessToken, '/v2/activity/sleep', startIso),
		fetchWhoopCollection<WhoopWorkout>(accessToken, '/v2/activity/workout', startIso)
	]);

	const result = await applyWhoopData(db, { cycles, recoveries, sleeps, workouts });
	await markSynced(db, 'whoop');
	return result;
}
