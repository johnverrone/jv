import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { getTodaySummary } from '$lib/server/db/coach';
import { requireCoachToken } from '$lib/server/coach/auth';
import { todayCentral } from '$lib/server/date';
import type { RequestHandler } from './$types';

/** Today's plan, logs, habits, streaks, and latest check-in — the daily agent's input. */
export const GET: RequestHandler = async ({ request, platform, url }) => {
	const denied = await requireCoachToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;

	const db = getDb(platform!.env.DB);
	const date = url.searchParams.get('date') ?? todayCentral();
	return json(await getTodaySummary(db, date));
};
