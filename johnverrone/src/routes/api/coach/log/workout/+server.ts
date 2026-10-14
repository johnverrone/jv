import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
	logWorkout,
	getWorkoutLog,
	updateWorkoutLog,
	setWorkoutExercises,
	listExercisesForWorkouts,
	type ExerciseInput
} from '$lib/server/db/coach';
import { MODALITIES, WORKOUT_STATUSES, WORKOUT_VARIANTS } from '$lib/server/db/schema';
import { exerciseSlug } from '$lib/coach/types';
import { requireApiToken } from '$lib/server/api/auth';
import { todayCentral } from '$lib/server/date';
import type { RequestHandler } from './$types';

/** Thrown by the field readers below; becomes a 400 naming the bad field. */
class BadField extends Error {}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Read an optional field. `undefined` → absent (leave it alone); `null` →
 * explicitly cleared; anything else must pass `check` or the request is
 * rejected. A wrong type is never silently stored as null — on the patch path
 * that would wipe a value the caller meant to keep.
 */
function field<T>(
	v: unknown,
	label: string,
	check: (v: unknown) => v is T,
	expected: string,
	nullable = true
): T | null | undefined {
	if (v === undefined) return undefined;
	if (v === null && nullable) return null;
	if (!check(v)) throw new BadField(`${label} must be ${expected}`);
	return v;
}

const isInt =
	(min: number, max = Infinity) =>
	(v: unknown): v is number =>
		typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
const isNonNegative = (v: unknown): v is number =>
	typeof v === 'number' && Number.isFinite(v) && v >= 0;
const isString = (v: unknown): v is string => typeof v === 'string';
const isDate = (v: unknown): v is string => typeof v === 'string' && DATE_RE.test(v);
const oneOf =
	<T extends string>(values: readonly T[]) =>
	(v: unknown): v is T =>
		values.includes(v as T);

/** `exercises` → insert input. Throws BadField naming the bad entry. */
function exercisesFrom(raw: unknown): ExerciseInput[] {
	if (!Array.isArray(raw)) throw new BadField('exercises must be an array');
	if (raw.length > 60) throw new BadField('exercises is capped at 60 entries per call');
	return raw.map((entry, i) => {
		if (!entry || typeof entry !== 'object') {
			throw new BadField(`exercises[${i}] must be an object`);
		}
		const e = entry as Record<string, unknown>;
		if (typeof e.name !== 'string' || !exerciseSlug(e.name)) {
			throw new BadField(`exercises[${i}].name must contain a letter or digit`);
		}
		const at = (key: string) => `exercises[${i}].${key}`;
		return {
			name: e.name,
			sets: field(e.sets, at('sets'), isInt(1), 'a positive integer'),
			reps: field(e.reps, at('reps'), isInt(1), 'a positive integer'),
			weightLb: field(e.weight_lb, at('weight_lb'), isNonNegative, 'a number ≥ 0'),
			rpe: field(e.rpe, at('rpe'), isInt(1, 10), 'an integer 1-10'),
			notes: field(e.notes, at('notes'), isString, 'a string')
		};
	});
}

/**
 * Log a workout on behalf of the user (agent-driven or future integrations).
 *
 * Without `id` this creates a log. With `id` it patches an existing one —
 * the path that matters for lifts, since Whoop's sync creates the workout row
 * on its own and the per-exercise detail gets filled in afterward. Only the
 * fields sent are touched (`null` clears one). Pass `exercises_mode: "append"`
 * to add to the existing exercises instead of replacing them.
 */
export const POST: RequestHandler = async ({ request, platform }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Body must be JSON' }, { status: 400 });
	}
	if (!body || typeof body !== 'object' || Array.isArray(body)) {
		return json({ error: 'Body must be a JSON object' }, { status: 400 });
	}

	try {
		const id = field(body.id, 'id', isInt(1), 'a positive integer', false);
		const mode =
			field(
				body.exercises_mode,
				'exercises_mode',
				oneOf(['replace', 'append'] as const),
				'"replace" or "append"',
				false
			) ?? 'replace';
		const exercises = body.exercises === undefined ? null : exercisesFrom(body.exercises);

		const fields = {
			date: field(body.date, 'date', isDate, 'yyyy-mm-dd', false),
			status: field(
				body.status,
				'status',
				oneOf(WORKOUT_STATUSES),
				`one of: ${WORKOUT_STATUSES.join(', ')}`,
				false
			),
			modality: field(
				body.modality,
				'modality',
				oneOf(MODALITIES),
				`one of: ${MODALITIES.join(', ')}`,
				false
			),
			variant: field(
				body.variant,
				'variant',
				oneOf(WORKOUT_VARIANTS),
				`one of: ${WORKOUT_VARIANTS.join(', ')}`,
				false
			),
			planSessionId: field(body.plan_session_id, 'plan_session_id', isInt(1), 'a positive integer'),
			durationMin: field(body.duration_min, 'duration_min', isInt(0), 'a non-negative integer'),
			rpe: field(body.rpe, 'rpe', isInt(1, 10), 'an integer 1-10'),
			notes: field(body.notes, 'notes', isString, 'a string')
		};

		const db = getDb(platform!.env.DB);

		// --- Patch an existing log ---
		if (id) {
			const existing = await getWorkoutLog(db, id);
			if (!existing) return json({ error: `No workout log with id ${id}` }, { status: 404 });

			const patch = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
			const updated = await updateWorkoutLog(db, id, patch);
			const rows = exercises
				? await setWorkoutExercises(db, id, exercises, mode)
				: ((await listExercisesForWorkouts(db, [id])).get(id) ?? []);
			return json({ ...updated, exercises: rows });
		}

		// --- Create ---
		if (!fields.status) throw new BadField(`status must be one of: ${WORKOUT_STATUSES.join(', ')}`);
		if (!fields.modality) throw new BadField(`modality must be one of: ${MODALITIES.join(', ')}`);

		const row = await logWorkout(db, {
			date: fields.date ?? todayCentral(),
			planSessionId: fields.planSessionId ?? null,
			status: fields.status,
			variant: fields.variant ?? 'full',
			modality: fields.modality,
			durationMin: fields.durationMin ?? null,
			rpe: fields.rpe ?? null,
			notes: fields.notes ?? null,
			source: 'api'
		});
		const rows = exercises?.length ? await setWorkoutExercises(db, row.id, exercises) : [];
		return json({ ...row, exercises: rows }, { status: 201 });
	} catch (e) {
		if (e instanceof BadField) return json({ error: e.message }, { status: 400 });
		throw e;
	}
};
