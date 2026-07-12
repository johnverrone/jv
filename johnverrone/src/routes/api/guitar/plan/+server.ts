import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { getPlan, setPlan } from '$lib/server/db/guitar';
import { requireApiToken } from '$lib/server/api/auth';
import type { RequestHandler } from './$types';

/** The practice plan — a single markdown blob. */
export const GET: RequestHandler = async ({ request, platform }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;
	return json({ content: await getPlan(getDb(platform!.env.DB)) });
};

/** Replace the plan content wholesale. */
export const POST: RequestHandler = async ({ request, platform }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;

	let body: { content?: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Body must be JSON' }, { status: 400 });
	}
	if (!body.content) return json({ error: 'content is required' }, { status: 400 });

	const plan = await setPlan(getDb(platform!.env.DB), body.content);
	return json(plan);
};
