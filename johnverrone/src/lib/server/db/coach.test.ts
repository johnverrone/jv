import { env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { getDb } from './index';
import {
	seedDefaultPlan,
	listPlanSessions,
	getSessionsForDay,
	logWorkout,
	listWorkoutLogs,
	upsertHabit,
	getHabit,
	getHabitStreaks,
	getWeekAdherence,
	getTodaySummary,
	addMetric,
	listMetrics,
	latestMetrics,
	addCheckIn,
	latestCheckIn
} from './coach';

// Fixed dates keep the tests deterministic: 2026-07-06 is a Monday.
const MON = '2026-07-06';
const TUE = '2026-07-07';
const WED = '2026-07-08';
const THU = '2026-07-09';

describe('coach data layer (real Miniflare D1)', () => {
	it('seeds the default plan idempotently', async () => {
		const db = getDb(env.DB);

		expect(await seedDefaultPlan(db)).toBe(true);
		const sessions = await listPlanSessions(db);
		expect(sessions).toHaveLength(7);

		// Second call is a no-op.
		expect(await seedDefaultPlan(db)).toBe(false);
		expect(await listPlanSessions(db)).toHaveLength(7);

		// Monday (dow 1) resolves to the anchor lift; every session has a bare minimum.
		const monday = await getSessionsForDay(db, 1);
		expect(monday).toHaveLength(1);
		expect(monday[0].name).toBe('Full body A');
		expect(sessions.every((s) => s.bareMin)).toBe(true);
	});

	it('upserts habits: create then patch without clobbering other fields', async () => {
		const db = getDb(env.DB);

		await upsertHabit(db, MON, { noAddedSugar: true });
		await upsertHabit(db, MON, { noAlcohol: true });

		const habit = await getHabit(db, MON);
		expect(habit?.noAddedSugar).toBe(true); // survived the second upsert
		expect(habit?.noAlcohol).toBe(true);
		expect(habit?.mobilityDone).toBe(false);
	});

	it('computes streaks with today-grace and gap semantics', async () => {
		const db = getDb(env.DB);

		// Mon+Tue+Wed sugar-free; Wed is "today".
		await upsertHabit(db, MON, { noAddedSugar: true, noAlcohol: true });
		await upsertHabit(db, TUE, { noAddedSugar: true });
		await upsertHabit(db, WED, { noAddedSugar: true });

		let streaks = await getHabitStreaks(db, WED);
		expect(streaks.noAddedSugar).toEqual({ current: 3, best: 3 });
		// Alcohol only logged Monday — Tuesday broke it.
		expect(streaks.noAlcohol).toEqual({ current: 0, best: 1 });

		// Grace: Thursday ("today") not yet logged — sugar streak still counts from Wed.
		streaks = await getHabitStreaks(db, THU);
		expect(streaks.noAddedSugar.current).toBe(3);

		// No grace beyond one day: from Friday, the unlogged Thursday breaks it, best survives.
		streaks = await getHabitStreaks(db, '2026-07-10');
		expect(streaks.noAddedSugar).toEqual({ current: 0, best: 3 });
	});

	it('computes week adherence: bare-min and modified count as done', async () => {
		const db = getDb(env.DB);
		await seedDefaultPlan(db);
		const sessions = await listPlanSessions(db);
		const strengthA = sessions.find((s) => s.name === 'Full body A')!;

		// Mon: bare-min lift. Tue: skipped run. Wed: swapped ride for a run.
		await logWorkout(db, {
			date: MON,
			planSessionId: strengthA.id,
			status: 'done',
			variant: 'bare_min',
			modality: 'lift',
			durationMin: 12
		});
		await logWorkout(db, { date: TUE, status: 'skipped', modality: 'run' });
		await logWorkout(db, { date: WED, status: 'modified', modality: 'run', durationMin: 30 });

		const week = await getWeekAdherence(db, MON);
		expect(week.planned).toBe(6); // Sunday is 'rest' modality and doesn't count as planned
		expect(week.done).toBe(2); // bare-min + modified; the skip doesn't count
		expect(week.pct).toBe(33);
		expect(week.days[0].date).toBe(MON);
		expect(week.days[0].logs).toHaveLength(1);
		expect(week.days[0].sessions[0].name).toBe('Full body A');
	});

	it('resolves the today summary for the right day of week', async () => {
		const db = getDb(env.DB);
		await seedDefaultPlan(db);
		await upsertHabit(db, TUE, { mobilityDone: true });
		await addCheckIn(db, { date: TUE, type: 'daily', author: 'coach', content: '**Go run.**' });

		const summary = await getTodaySummary(db, TUE);
		expect(summary.dayOfWeek).toBe(2);
		expect(summary.sessions[0].name).toBe('Easy run');
		expect(summary.habit?.mobilityDone).toBe(true);
		expect(summary.streaks.mobilityDone.current).toBe(1);
		expect(summary.latestCheckIn?.content).toBe('**Go run.**');
		expect(summary.weekAdherence.weekStart).toBe(MON);
	});

	it('paginates workout logs newest-first', async () => {
		const db = getDb(env.DB);
		// Own week + from/to bounds so this test is independent of other tests' logs
		// (storage is shared across tests within a file).
		const range = { from: '2026-08-03', to: '2026-08-09' };
		for (const date of ['2026-08-03', '2026-08-04', '2026-08-05']) {
			await logWorkout(db, { date, status: 'done', modality: 'run' });
		}
		const page1 = await listWorkoutLogs(db, { ...range, limit: 2 });
		expect(page1.map((l) => l.date)).toEqual(['2026-08-05', '2026-08-04']);
		const page2 = await listWorkoutLogs(db, { ...range, limit: 2, offset: 2 });
		expect(page2.map((l) => l.date)).toEqual(['2026-08-03']);
	});

	it('upserts metrics on date+type and reports latest per type', async () => {
		const db = getDb(env.DB);

		await addMetric(db, { date: MON, type: 'weight_lb', value: 192.4 });
		await addMetric(db, { date: MON, type: 'weight_lb', value: 191.8 }); // same-day correction
		await addMetric(db, { date: TUE, type: 'weight_lb', value: 191.2 });
		await addMetric(db, { date: MON, type: 'a1c', value: 5.9 });

		const weights = await listMetrics(db, 'weight_lb');
		expect(weights).toHaveLength(2);
		expect(weights[0].value).toBe(191.2); // newest first

		const latest = await latestMetrics(db);
		expect(latest.find((m) => m.type === 'weight_lb')?.value).toBe(191.2);
		expect(latest.find((m) => m.type === 'a1c')?.value).toBe(5.9);
	});

	it('returns the latest check-in, optionally by type', async () => {
		const db = getDb(env.DB);
		await addCheckIn(db, { date: MON, type: 'weekly', author: 'coach', content: 'week review' });
		await addCheckIn(db, { date: TUE, type: 'daily', author: 'coach', content: 'daily nudge' });

		expect((await latestCheckIn(db))?.content).toBe('daily nudge');
		expect((await latestCheckIn(db, 'weekly'))?.content).toBe('week review');
	});
});
