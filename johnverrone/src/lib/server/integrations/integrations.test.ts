import { env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { getDb } from '../db';
import { getOAuthToken, saveOAuthToken, deleteOAuthToken } from '../db/integrations';
import { seedDefaultPlan, listPlanSessions, listWorkoutLogs, listMetrics } from '../db/coach';
import { importStravaActivities, mapSportType, type StravaActivity } from './strava';
import {
	applyWhoopData,
	importWhoopWorkouts,
	isIgnoredWhoopSport,
	mapWhoopSport,
	whoopLocalDate,
	type WhoopWorkout
} from './whoop';

describe('oauth token storage', () => {
	it('saves, rotates, and deletes a token pair', async () => {
		const db = getDb(env.DB);

		await saveOAuthToken(db, {
			provider: 'strava',
			accessToken: 'a1',
			refreshToken: 'r1',
			expiresAt: 1000,
			athleteId: '42',
			scopes: 'activity:read_all'
		});
		expect((await getOAuthToken(db, 'strava'))?.accessToken).toBe('a1');

		// Rotation replaces the pair but keeps the row (provider is the PK).
		await saveOAuthToken(db, {
			provider: 'strava',
			accessToken: 'a2',
			refreshToken: 'r2',
			expiresAt: 2000,
			athleteId: '42',
			scopes: 'activity:read_all'
		});
		const rotated = await getOAuthToken(db, 'strava');
		expect(rotated?.refreshToken).toBe('r2');
		expect(rotated?.expiresAt).toBe(2000);

		await deleteOAuthToken(db, 'strava');
		expect(await getOAuthToken(db, 'strava')).toBeNull();
	});
});

describe('strava import', () => {
	const run = (
		id: number,
		dateTime: string,
		extra: Partial<StravaActivity> = {}
	): StravaActivity => ({
		id,
		sport_type: 'Run',
		start_date_local: dateTime,
		moving_time: 1800,
		name: 'Morning Run',
		...extra
	});

	it('maps sport types to modalities', () => {
		expect(mapSportType('TrailRun')).toBe('run');
		expect(mapSportType('VirtualRide')).toBe('bike');
		expect(mapSportType('WeightTraining')).toBe('lift');
		expect(mapSportType('Golf')).toBeNull();
	});

	it('imports, links the planned session, and dedupes on re-sync', async () => {
		const db = getDb(env.DB);
		await seedDefaultPlan(db);
		const easyRun = (await listPlanSessions(db)).find((s) => s.name === 'Easy run')!;

		// 2026-09-15 is a Tuesday — matches the seeded easy run.
		const first = await importStravaActivities(db, [run(9001, '2026-09-15T06:30:00Z')]);
		expect(first).toEqual({ imported: 1, duplicates: 0, replaced: 0, unmapped: [] });

		const [log] = await listWorkoutLogs(db, { from: '2026-09-15', to: '2026-09-15' });
		expect(log.planSessionId).toBe(easyRun.id);
		expect(log.source).toBe('strava');
		expect(log.durationMin).toBe(30);

		// Re-sync of the same activity is a no-op.
		const again = await importStravaActivities(db, [run(9001, '2026-09-15T06:30:00Z')]);
		expect(again).toEqual({ imported: 0, duplicates: 1, replaced: 0, unmapped: [] });
	});

	it('treats a manually-logged date+modality as a duplicate and reports unmapped types', async () => {
		const db = getDb(env.DB);

		// Manual log already covers a Wednesday ride...
		const { logWorkout } = await import('../db/coach');
		await logWorkout(db, { date: '2026-09-16', status: 'done', modality: 'bike' });

		const result = await importStravaActivities(db, [
			run(9002, '2026-09-16T18:00:00Z', { sport_type: 'Ride' }),
			run(9003, '2026-09-16T20:00:00Z', { sport_type: 'Pickleball' }),
			run(9004, '2026-09-16T21:00:00Z', { sport_type: 'Golf' })
		]);
		expect(result.imported).toBe(0);
		expect(result.duplicates).toBe(1);
		// Golf is deliberately ignored, not reported as unmapped.
		expect(result.unmapped).toEqual(['Pickleball']);
	});
});

describe('whoop import', () => {
	it('resolves local dates across the offset', () => {
		// 3am UTC with a -05:00 offset is still the previous local day.
		expect(whoopLocalDate('2026-09-15T03:00:00.000Z', '-05:00')).toBe('2026-09-14');
		expect(whoopLocalDate('2026-09-15T12:00:00.000Z', '-05:00')).toBe('2026-09-15');
	});

	it('folds cycles/recovery/sleep into per-day metrics, skipping unscored and naps', async () => {
		const db = getDb(env.DB);

		const result = await applyWhoopData(db, {
			workouts: [],
			cycles: [
				{
					id: 1,
					start: '2026-09-14T09:00:00.000Z',
					timezone_offset: '-05:00',
					score_state: 'SCORED',
					score: { strain: 12.34, average_heart_rate: 88, max_heart_rate: 160 }
				},
				{
					id: 2,
					start: '2026-09-15T09:00:00.000Z',
					timezone_offset: '-05:00',
					score_state: 'PENDING_SCORE'
				}
			],
			recoveries: [
				{
					cycle_id: 1,
					created_at: '2026-09-14T10:00:00.000Z',
					score_state: 'SCORED',
					score: {
						recovery_score: 61,
						resting_heart_rate: 52,
						hrv_rmssd_milli: 48.72,
						user_calibrating: false
					}
				}
			],
			sleeps: [
				{
					id: 's1',
					end: '2026-09-14T11:10:00.000Z',
					timezone_offset: '-05:00',
					nap: false,
					score_state: 'SCORED',
					score: { sleep_performance_percentage: 84 }
				},
				{
					id: 's2',
					end: '2026-09-14T20:00:00.000Z',
					timezone_offset: '-05:00',
					nap: true,
					score_state: 'SCORED',
					score: { sleep_performance_percentage: 90 }
				}
			]
		});

		expect(result.metrics).toBe(5); // strain, recovery, rhr, hrv, sleep (nap + unscored skipped)
		const day = '2026-09-14';
		expect((await listMetrics(db, 'whoop_strain')).find((m) => m.date === day)?.value).toBe(12.3);
		expect((await listMetrics(db, 'whoop_recovery')).find((m) => m.date === day)?.value).toBe(61);
		expect((await listMetrics(db, 'resting_hr')).find((m) => m.date === day)?.value).toBe(52);
		expect((await listMetrics(db, 'hrv_ms')).find((m) => m.date === day)?.value).toBe(48.7);
		expect((await listMetrics(db, 'sleep_perf')).find((m) => m.date === day)?.value).toBe(84);
	});
});

describe('whoop workouts + cross-provider dedupe', () => {
	const lift = (id: string, start: string, extra: Partial<WhoopWorkout> = {}): WhoopWorkout => ({
		id,
		start,
		end: new Date(new Date(start).getTime() + 45 * 60_000).toISOString(),
		timezone_offset: '-05:00',
		sport_name: 'weightlifting',
		score_state: 'SCORED',
		score: { strain: 8.6, average_heart_rate: 110 },
		...extra
	});

	it('maps and normalizes whoop sport names', () => {
		expect(mapWhoopSport('weightlifting')).toBe('lift');
		expect(mapWhoopSport('weightlifting_msk')).toBe('lift');
		expect(mapWhoopSport('Powerlifting MSK')).toBe('lift');
		expect(mapWhoopSport('Functional Fitness')).toBe('hiit');
		expect(mapWhoopSport('walking')).toBe('walk');
		expect(mapWhoopSport('stroller_walking')).toBe('walk');
		expect(mapWhoopSport('hiking')).toBe('hike');
		expect(mapWhoopSport('hiking-rucking')).toBe('hike');
		expect(mapWhoopSport('Hiking/Rucking')).toBe('hike');
		expect(mapWhoopSport('table tennis')).toBeNull();
		// Deliberately ignored sports stay unmapped but are skipped silently.
		expect(mapWhoopSport('golf')).toBeNull();
		expect(isIgnoredWhoopSport('golf')).toBe(true);
		expect(isIgnoredWhoopSport('activity')).toBe(true);
		expect(isIgnoredWhoopSport('table tennis')).toBe(false);
	});

	it('imports whoop workouts, links the plan, and dedupes on re-sync', async () => {
		const db = getDb(env.DB);
		await seedDefaultPlan(db);
		const fullBodyA = (await listPlanSessions(db)).find((s) => s.name === 'Full body A')!;

		// 2026-09-21 is a Monday — noon UTC is 7am Central, same local date.
		const first = await importWhoopWorkouts(db, [lift('w-1', '2026-09-21T12:00:00.000Z')]);
		expect(first).toEqual({ imported: 1, duplicates: 0, replaced: 0, unmapped: [] });

		const [log] = await listWorkoutLogs(db, { from: '2026-09-21', to: '2026-09-21' });
		expect(log.source).toBe('whoop');
		expect(log.planSessionId).toBe(fullBodyA.id);
		expect(log.durationMin).toBe(45);

		const again = await importWhoopWorkouts(db, [lift('w-1', '2026-09-21T12:00:00.000Z')]);
		expect(again.imported).toBe(0);
		expect(again.duplicates).toBe(1);
	});

	it('skips whoop workouts already covered by strava, and strava replaces whoop', async () => {
		const db = getDb(env.DB);

		// Strava already has Tuesday's run → whoop's version is a duplicate.
		await importStravaActivities(db, [
			{ id: 8801, sport_type: 'Run', start_date_local: '2026-09-22T06:30:00Z', moving_time: 1800 }
		]);
		const whoopRun = await importWhoopWorkouts(db, [
			lift('w-2', '2026-09-22T11:30:00.000Z', { sport_name: 'running' })
		]);
		expect(whoopRun).toEqual({ imported: 0, duplicates: 1, replaced: 0, unmapped: [] });

		// Whoop-first order: whoop lands Wednesday's walk, then strava sees it too — strava wins.
		await importWhoopWorkouts(db, [
			lift('w-3', '2026-09-23T22:00:00.000Z', { sport_name: 'walking' })
		]);
		const strava = await importStravaActivities(db, [
			{ id: 8802, sport_type: 'Walk', start_date_local: '2026-09-23T17:00:00Z', moving_time: 2400 }
		]);
		expect(strava.imported).toBe(1);
		expect(strava.replaced).toBe(1);

		const logs = await listWorkoutLogs(db, { from: '2026-09-23', to: '2026-09-23' });
		expect(logs).toHaveLength(1);
		expect(logs[0].source).toBe('strava');
		expect(logs[0].durationMin).toBe(40);
	});
});
