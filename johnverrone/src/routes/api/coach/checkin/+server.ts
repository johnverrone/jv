import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { addCheckIn } from '$lib/server/db/coach';
import { CHECK_IN_TYPES } from '$lib/server/db/schema';
import { requireApiToken } from '$lib/server/api/auth';
import { todayCentral } from '$lib/server/date';
import type { RequestHandler } from './$types';

/** Where scheduled agents deposit coaching messages; surfaced on the Today page. */
export const POST: RequestHandler = async ({ request, platform }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;

	let body: { type?: string; content?: string; date?: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Body must be JSON' }, { status: 400 });
	}

	const type = CHECK_IN_TYPES.find((t) => t === body.type);
	if (!type) {
		return json({ error: `type must be one of: ${CHECK_IN_TYPES.join(', ')}` }, { status: 400 });
	}
	const content = String(body.content ?? '').trim();
	if (!content) return json({ error: 'content is required' }, { status: 400 });

	const db = getDb(platform!.env.DB);
	const row = await addCheckIn(db, {
		date: body.date ?? todayCentral(),
		type,
		author: 'coach',
		content
	});
	return json(row, { status: 201 });
};
