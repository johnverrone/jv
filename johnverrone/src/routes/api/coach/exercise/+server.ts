import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { getExerciseHistory } from '$lib/server/db/coach';
import { requireApiToken } from '$lib/server/api/auth';
import { addDays, todayCentral } from '$lib/server/date';
import type { RequestHandler } from './$types';

/**
 * Progression for one exercise: `?name=back squat&weeks=3`. One entry per day
 * with that day's top set and estimated 1RM, newest first — so "has my squat
 * gone up in the last three weeks?" is one call, not a scan of every workout.
 * Names are matched loosely (case, spaces, and hyphens don't matter).
 */
export const GET: RequestHandler = async ({ request, platform, url }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;

	const name = url.searchParams.get('name')?.trim();
	if (!name) return json({ error: 'name is required' }, { status: 400 });

	const weeks = Number(url.searchParams.get('weeks'));
	const days = Number(url.searchParams.get('days'));
	const window = Number.isFinite(weeks) && weeks > 0 ? Math.min(weeks, 52) * 7 : null;
	const span = window ?? (Number.isFinite(days) && days > 0 ? Math.min(days, 365) : null);

	const today = todayCentral();
	const limit = Math.min(Number(url.searchParams.get('limit')) || 50, 200);

	const history = await getExerciseHistory(getDb(platform!.env.DB), name, {
		from: span ? addDays(today, -(span - 1)) : undefined,
		to: today,
		limit
	});
	return json(history);
};
