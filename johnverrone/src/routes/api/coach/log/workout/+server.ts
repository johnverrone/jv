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
import { requireApiToken } from '$lib/server/api/auth';
import { todayCentral } from '$lib/server/date';
import type { RequestHandler } from './$types';

interface ExerciseBody {
	name?: unknown;
	sets?: unknown;
	reps?: unknown;
	weight_lb?: unknown;
	rpe?: unknown;
	notes?: unknown;
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const int = (v: unknown) => (typeof v === 'number' && Number.isInteger(v) ? v : null);

/** `exercises` → insert input, or an error message naming the bad entry. */
function exercisesFrom(raw: unknown): { exercises: ExerciseInput[] } | { error: string } {
	if (!Array.isArray(raw)) return { error: 'exercises must be an array' };
	if (raw.length > 60) return { error: 'exercises is capped at 60 entries per call' };
	const exercises: ExerciseInput[] = [];
	for (const [i, entry] of raw.entries()) {
		if (!entry || typeof entry !== 'object') return { error: `exercises[${i}] must be an object` };
		const e = entry as ExerciseBody;
		if (typeof e.name !== 'string' || !e.name.trim()) {
			return { error: `exercises[${i}].name is required` };
		}
		const rpe = int(e.rpe);
		if (rpe !== null && (rpe < 1 || rpe > 10)) {
			return { error: `exercises[${i}].rpe must be 1-10` };
		}
		exercises.push({
			name: e.name,
			sets: int(e.sets),
			reps: int(e.reps),
			weightLb: num(e.weight_lb),
			rpe,
			notes: typeof e.notes === 'string' ? e.notes : null
		});
	}
	return { exercises };
}

/**
 * Log a workout on behalf of the user (agent-driven or future integrations).
 *
 * Without `id` this creates a log. With `id` it patches an existing one —
 * the path that matters for lifts, since Whoop's sync creates the workout row
 * on its own and the per-exercise detail gets filled in afterward. Pass
 * `exercises_mode: "append"` to add to what's already there instead of
 * replacing it.
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

	if (
		body.exercises_mode !== undefined &&
		body.exercises_mode !== 'append' &&
		body.exercises_mode !== 'replace'
	) {
		return json({ error: 'exercises_mode must be "append" or "replace"' }, { status: 400 });
	}
	const mode = body.exercises_mode === 'append' ? 'append' : 'replace';

	let exercises: ExerciseInput[] | null = null;
	if (body.exercises !== undefined) {
		const parsed = exercisesFrom(body.exercises);
		if ('error' in parsed) return json({ error: parsed.error }, { status: 400 });
		exercises = parsed.exercises;
	}

	const db = getDb(platform!.env.DB);

	// --- Patch an existing log ---
	if (body.id !== undefined) {
		if (typeof body.id !== 'number') return json({ error: 'id must be a number' }, { status: 400 });
		const existing = await getWorkoutLog(db, body.id);
		if (!existing) return json({ error: `No workout log with id ${body.id}` }, { status: 404 });

		const patch: Record<string, unknown> = {};
		if (body.status !== undefined) {
			const status = WORKOUT_STATUSES.find((s) => s === body.status);
			if (!status) {
				return json(
					{ error: `status must be one of: ${WORKOUT_STATUSES.join(', ')}` },
					{ status: 400 }
				);
			}
			patch.status = status;
		}
		if (body.modality !== undefined) {
			const modality = MODALITIES.find((m) => m === body.modality);
			if (!modality) {
				return json(
					{ error: `modality must be one of: ${MODALITIES.join(', ')}` },
					{ status: 400 }
				);
			}
			patch.modality = modality;
		}
		if (body.variant !== undefined) {
			const variant = WORKOUT_VARIANTS.find((v) => v === body.variant);
			if (!variant) {
				return json(
					{ error: `variant must be one of: ${WORKOUT_VARIANTS.join(', ')}` },
					{ status: 400 }
				);
			}
			patch.variant = variant;
		}
		if (body.duration_min !== undefined) patch.durationMin = int(body.duration_min);
		if (body.rpe !== undefined) patch.rpe = int(body.rpe);
		if (body.notes !== undefined) patch.notes = typeof body.notes === 'string' ? body.notes : null;
		if (body.plan_session_id !== undefined) patch.planSessionId = int(body.plan_session_id);

		const updated = await updateWorkoutLog(db, body.id, patch);
		const rows = exercises
			? await setWorkoutExercises(db, body.id, exercises, mode)
			: ((await listExercisesForWorkouts(db, [body.id])).get(body.id) ?? []);
		return json({ ...updated, exercises: rows });
	}

	// --- Create ---
	const status = WORKOUT_STATUSES.find((s) => s === body.status);
	if (!status) {
		return json(
			{ error: `status must be one of: ${WORKOUT_STATUSES.join(', ')}` },
			{ status: 400 }
		);
	}
	const modality = MODALITIES.find((m) => m === body.modality);
	if (!modality) {
		return json({ error: `modality must be one of: ${MODALITIES.join(', ')}` }, { status: 400 });
	}
	const variant = WORKOUT_VARIANTS.find((v) => v === body.variant) ?? 'full';

	const row = await logWorkout(db, {
		date: typeof body.date === 'string' ? body.date : todayCentral(),
		planSessionId: typeof body.plan_session_id === 'number' ? body.plan_session_id : null,
		status,
		variant,
		modality,
		durationMin: typeof body.duration_min === 'number' ? body.duration_min : null,
		rpe: typeof body.rpe === 'number' ? body.rpe : null,
		notes: typeof body.notes === 'string' ? body.notes : null,
		source: 'api'
	});
	const rows = exercises?.length ? await setWorkoutExercises(db, row.id, exercises) : [];
	return json({ ...row, exercises: rows }, { status: 201 });
};
