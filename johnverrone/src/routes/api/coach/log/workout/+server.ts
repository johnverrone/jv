import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { logWorkout } from '$lib/server/db/coach';
import { MODALITIES, WORKOUT_STATUSES, WORKOUT_VARIANTS } from '$lib/server/db/schema';
import { requireCoachToken } from '$lib/server/coach/auth';
import { todayCentral } from '$lib/server/date';
import type { RequestHandler } from './$types';

/** Log a workout on behalf of the user (agent-driven or future integrations). */
export const POST: RequestHandler = async ({ request, platform }) => {
	const denied = await requireCoachToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Body must be JSON' }, { status: 400 });
	}

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

	const db = getDb(platform!.env.DB);
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
	return json(row, { status: 201 });
};
