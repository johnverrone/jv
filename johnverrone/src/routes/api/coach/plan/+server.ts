import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
	listPlanSessions,
	createPlanSession,
	updatePlanSession,
	deletePlanSession
} from '$lib/server/db/coach';
import { MODALITIES } from '$lib/server/db/schema';
import { requireApiToken } from '$lib/server/api/auth';
import type { RequestHandler } from './$types';

/** The weekly template — what the planning agent reads before a weekly review. */
export const GET: RequestHandler = async ({ request, platform }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;
	return json(await listPlanSessions(getDb(platform!.env.DB)));
};

type Body = {
	id?: number;
	delete?: boolean;
	name?: string;
	modality?: string;
	day_of_week?: number;
	sort_order?: number;
	duration_min?: number | null;
	prescription?: string | null;
	bare_min?: string | null;
	bare_min_duration_min?: number | null;
	active?: boolean;
};

function patchFrom(body: Body) {
	const patch: Record<string, unknown> = {};
	if (typeof body.name === 'string' && body.name.trim()) patch.name = body.name.trim();
	if (body.modality !== undefined) {
		const modality = MODALITIES.find((m) => m === body.modality);
		if (!modality) return { error: `modality must be one of: ${MODALITIES.join(', ')}` };
		patch.modality = modality;
	}
	if (body.day_of_week !== undefined) {
		if (!Number.isInteger(body.day_of_week) || body.day_of_week < 0 || body.day_of_week > 6) {
			return { error: 'day_of_week must be 0 (Sunday) through 6 (Saturday)' };
		}
		patch.dayOfWeek = body.day_of_week;
	}
	if (body.sort_order !== undefined) patch.sortOrder = body.sort_order;
	if (body.duration_min !== undefined) patch.durationMin = body.duration_min;
	if (body.prescription !== undefined) patch.prescription = body.prescription;
	if (body.bare_min !== undefined) patch.bareMin = body.bare_min;
	if (body.bare_min_duration_min !== undefined)
		patch.bareMinDurationMin = body.bare_min_duration_min;
	if (body.active !== undefined) patch.active = Boolean(body.active);
	return { patch };
}

/**
 * Adjust the weekly template — how the planning agent applies a weekly update.
 * `{id, ...fields}` patches a session; `{id, delete: true}` removes it;
 * `{name, modality, day_of_week, ...}` without an id creates one.
 */
export const POST: RequestHandler = async ({ request, platform }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;

	let body: Body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Body must be JSON' }, { status: 400 });
	}

	const db = getDb(platform!.env.DB);

	if (body.id && body.delete) {
		await deletePlanSession(db, body.id);
		return json({ deleted: body.id });
	}

	const result = patchFrom(body);
	if ('error' in result) return json({ error: result.error }, { status: 400 });
	const { patch } = result;

	if (body.id) {
		const updated = await updatePlanSession(db, body.id, patch);
		if (!updated) return json({ error: `No plan session with id ${body.id}` }, { status: 404 });
		return json(updated);
	}

	if (!patch.name || !patch.modality || patch.dayOfWeek === undefined) {
		return json(
			{ error: 'Creating a session requires name, modality, and day_of_week' },
			{ status: 400 }
		);
	}
	const created = await createPlanSession(db, patch as Parameters<typeof createPlanSession>[1]);
	return json(created, { status: 201 });
};
