import { eq, and, desc, asc, gte, lte, sql } from 'drizzle-orm';
import type { DB } from './index';
import {
	planSession,
	workoutLog,
	habitLog,
	bodyMetric,
	checkIn,
	type PlanSession,
	type WorkoutLog,
	type HabitLog,
	type NewPlanSession,
	type NewWorkoutLog,
	type NewBodyMetric,
	type NewCheckIn,
	type CheckIn
} from './schema';
import { DEFAULT_PLAN } from '../coach/defaultPlan';
import { addDays, dayOfWeek, weekStart } from '../date';

const now = sql`(datetime('now'))`;

// --- Plan template ---

export async function listPlanSessions(db: DB) {
	return db
		.select()
		.from(planSession)
		.orderBy(asc(planSession.dayOfWeek), asc(planSession.sortOrder));
}

/** Active sessions for a day of week (0=Sunday..6=Saturday). */
export async function getSessionsForDay(db: DB, dow: number) {
	return db
		.select()
		.from(planSession)
		.where(and(eq(planSession.dayOfWeek, dow), eq(planSession.active, true)))
		.orderBy(asc(planSession.sortOrder));
}

export async function createPlanSession(
	db: DB,
	input: Omit<NewPlanSession, 'id' | 'createdAt' | 'updatedAt'>
) {
	const [session] = await db.insert(planSession).values(input).returning();
	return session;
}

export async function updatePlanSession(db: DB, id: number, patch: Partial<NewPlanSession>) {
	const [session] = await db
		.update(planSession)
		.set({ ...patch, updatedAt: now })
		.where(eq(planSession.id, id))
		.returning();
	return session ?? null;
}

export async function deletePlanSession(db: DB, id: number) {
	await db.delete(planSession).where(eq(planSession.id, id));
}

/** Seed the default weekly template. Idempotent: no-op when any sessions exist. */
export async function seedDefaultPlan(db: DB) {
	const existing = await db.select({ id: planSession.id }).from(planSession).limit(1);
	if (existing.length) return false;
	await db.insert(planSession).values(DEFAULT_PLAN);
	return true;
}

// --- Workout log ---

export async function logWorkout(db: DB, input: Omit<NewWorkoutLog, 'id' | 'createdAt'>) {
	const [entry] = await db.insert(workoutLog).values(input).returning();
	return entry;
}

export async function getWorkoutsForDate(db: DB, date: string) {
	return db.select().from(workoutLog).where(eq(workoutLog.date, date)).orderBy(asc(workoutLog.id));
}

export async function listWorkoutLogs(
	db: DB,
	opts: { from?: string; to?: string; limit?: number; offset?: number } = {}
) {
	const filters = [];
	if (opts.from) filters.push(gte(workoutLog.date, opts.from));
	if (opts.to) filters.push(lte(workoutLog.date, opts.to));

	return db
		.select()
		.from(workoutLog)
		.where(filters.length ? and(...filters) : undefined)
		.orderBy(desc(workoutLog.date), desc(workoutLog.id))
		.limit(opts.limit ?? 50)
		.offset(opts.offset ?? 0);
}

export async function deleteWorkoutLog(db: DB, id: number) {
	await db.delete(workoutLog).where(eq(workoutLog.id, id));
}

// --- Habits ---

type HabitPatch = Partial<Pick<HabitLog, 'noAddedSugar' | 'noAlcohol' | 'mobilityDone' | 'notes'>>;

/** Create or patch the single habit row for a date. */
export async function upsertHabit(db: DB, date: string, patch: HabitPatch) {
	const [row] = await db
		.insert(habitLog)
		.values({ date, ...patch })
		.onConflictDoUpdate({ target: habitLog.date, set: { ...patch, updatedAt: now } })
		.returning();
	return row;
}

export async function getHabit(db: DB, date: string) {
	const [row] = await db.select().from(habitLog).where(eq(habitLog.date, date)).limit(1);
	return row ?? null;
}

export async function listHabits(db: DB, opts: { from: string; to: string }) {
	return db
		.select()
		.from(habitLog)
		.where(and(gte(habitLog.date, opts.from), lte(habitLog.date, opts.to)))
		.orderBy(desc(habitLog.date));
}

// --- Streaks ---

export interface StreakInfo {
	current: number;
	best: number;
}

export interface HabitStreaks {
	noAddedSugar: StreakInfo;
	noAlcohol: StreakInfo;
	mobilityDone: StreakInfo;
}

type HabitField = 'noAddedSugar' | 'noAlcohol' | 'mobilityDone';

/**
 * Current + best streak per habit over the last ~400 logged days.
 * Grace rule: an unlogged/false *today* doesn't break the current streak (the
 * day isn't over yet) — the walk simply starts from yesterday. An unlogged or
 * false *yesterday* does break it.
 */
export async function getHabitStreaks(db: DB, today: string): Promise<HabitStreaks> {
	const rows = await db.select().from(habitLog).orderBy(desc(habitLog.date)).limit(400);
	const byDate = new Map(rows.map((r) => [r.date, r]));
	const isTrue = (date: string, field: HabitField) => byDate.get(date)?.[field] === true;

	const streakFor = (field: HabitField): StreakInfo => {
		let start = today;
		if (!isTrue(start, field)) start = addDays(start, -1);
		let current = 0;
		for (let d = start; isTrue(d, field); d = addDays(d, -1)) current++;

		// Best: walk oldest→newest; a run continues only across consecutive true days.
		let best = 0;
		let run = 0;
		let lastTrueDate: string | null = null;
		for (let i = rows.length - 1; i >= 0; i--) {
			const row = rows[i];
			if (row[field]) {
				run = lastTrueDate === addDays(row.date, -1) ? run + 1 : 1;
				lastTrueDate = row.date;
				if (run > best) best = run;
			}
		}
		return { current, best: Math.max(best, current) };
	};

	return {
		noAddedSugar: streakFor('noAddedSugar'),
		noAlcohol: streakFor('noAlcohol'),
		mobilityDone: streakFor('mobilityDone')
	};
}

// --- Adherence ---

export interface DayPlanStatus {
	date: string;
	dayOfWeek: number;
	sessions: PlanSession[];
	logs: WorkoutLog[];
}

export interface WeekAdherence {
	weekStart: string;
	planned: number;
	done: number;
	pct: number;
	days: DayPlanStatus[];
}

/**
 * Plan-vs-actual for the week starting at `weekStartDate` (a Monday).
 * `done` counts done + modified logs; a bare-minimum variant counts fully —
 * consistency over volume is the whole point of the fallback.
 */
export async function getWeekAdherence(db: DB, weekStartDate: string): Promise<WeekAdherence> {
	const dates = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));
	const [sessions, logs] = await Promise.all([
		db.select().from(planSession).where(eq(planSession.active, true)),
		listWorkoutLogs(db, { from: dates[0], to: dates[6], limit: 100 })
	]);

	const days: DayPlanStatus[] = dates.map((date) => {
		const dow = dayOfWeek(date);
		return {
			date,
			dayOfWeek: dow,
			sessions: sessions
				.filter((s) => s.dayOfWeek === dow)
				.sort((a, b) => a.sortOrder - b.sortOrder),
			logs: logs.filter((l) => l.date === date)
		};
	});

	const planned = days.reduce(
		(n, d) => n + d.sessions.filter((s) => s.modality !== 'rest').length,
		0
	);
	const done = logs.filter((l) => l.status === 'done' || l.status === 'modified').length;
	const pct = planned ? Math.round((Math.min(done, planned) / planned) * 100) : 0;

	return { weekStart: weekStartDate, planned, done, pct, days };
}

// --- Today summary (powers the Today page and GET /api/coach/today) ---

export async function getTodaySummary(db: DB, date: string) {
	const dow = dayOfWeek(date);
	const [sessions, workouts, habit, streaks, latest, adherence, todayMetrics] = await Promise.all([
		getSessionsForDay(db, dow),
		getWorkoutsForDate(db, date),
		getHabit(db, date),
		getHabitStreaks(db, date),
		latestCheckIn(db),
		getWeekAdherence(db, weekStart(date)),
		getMetricsForDate(db, date)
	]);
	return {
		date,
		dayOfWeek: dow,
		sessions,
		workouts,
		habit,
		streaks,
		latestCheckIn: latest,
		weekAdherence: adherence,
		todayMetrics
	};
}

export type TodaySummary = Awaited<ReturnType<typeof getTodaySummary>>;

// --- Body metrics ---

export async function addMetric(db: DB, input: Omit<NewBodyMetric, 'id' | 'createdAt'>) {
	const [row] = await db
		.insert(bodyMetric)
		.values(input)
		.onConflictDoUpdate({
			target: [bodyMetric.date, bodyMetric.type],
			set: { value: input.value, notes: input.notes ?? null }
		})
		.returning();
	return row;
}

export async function getMetricsForDate(db: DB, date: string) {
	return db
		.select()
		.from(bodyMetric)
		.where(eq(bodyMetric.date, date))
		.orderBy(asc(bodyMetric.type));
}

export async function listMetrics(db: DB, type: string, limit = 90) {
	return db
		.select()
		.from(bodyMetric)
		.where(eq(bodyMetric.type, type))
		.orderBy(desc(bodyMetric.date))
		.limit(limit);
}

/** Latest reading per metric type. */
export async function latestMetrics(db: DB) {
	const rows = await db.select().from(bodyMetric).orderBy(desc(bodyMetric.date));
	const seen = new Map<string, (typeof rows)[number]>();
	for (const row of rows) if (!seen.has(row.type)) seen.set(row.type, row);
	return [...seen.values()];
}

export async function deleteMetric(db: DB, id: number) {
	await db.delete(bodyMetric).where(eq(bodyMetric.id, id));
}

// --- Check-ins ---

export async function addCheckIn(db: DB, input: Omit<NewCheckIn, 'id' | 'createdAt'>) {
	const [row] = await db.insert(checkIn).values(input).returning();
	return row;
}

export async function latestCheckIn(db: DB, type?: CheckIn['type']) {
	const [row] = await db
		.select()
		.from(checkIn)
		.where(type ? eq(checkIn.type, type) : undefined)
		.orderBy(desc(checkIn.date), desc(checkIn.id))
		.limit(1);
	return row ?? null;
}

export async function listCheckIns(db: DB, opts: { limit?: number; offset?: number } = {}) {
	return db
		.select()
		.from(checkIn)
		.orderBy(desc(checkIn.date), desc(checkIn.id))
		.limit(opts.limit ?? 20)
		.offset(opts.offset ?? 0);
}
