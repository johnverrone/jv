import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { upsertHabit } from '$lib/server/db/coach';
import { requireApiToken } from '$lib/server/api/auth';
import { todayCentral } from '$lib/server/date';
import type { RequestHandler } from './$types';

/** Partial habit patch, e.g. {"no_added_sugar": true}. Upserts the day's row. */
export const POST: RequestHandler = async ({ request, platform }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Body must be JSON' }, { status: 400 });
	}

	const patch: Parameters<typeof upsertHabit>[2] = {};
	if (typeof body.no_added_sugar === 'boolean') patch.noAddedSugar = body.no_added_sugar;
	if (typeof body.no_alcohol === 'boolean') patch.noAlcohol = body.no_alcohol;
	if (typeof body.mobility_done === 'boolean') patch.mobilityDone = body.mobility_done;
	if (typeof body.notes === 'string') patch.notes = body.notes;
	if (Object.keys(patch).length === 0) {
		return json(
			{ error: 'Provide at least one of: no_added_sugar, no_alcohol, mobility_done, notes' },
			{ status: 400 }
		);
	}

	const db = getDb(platform!.env.DB);
	const date = typeof body.date === 'string' ? body.date : todayCentral();
	return json(await upsertHabit(db, date, patch), { status: 201 });
};
