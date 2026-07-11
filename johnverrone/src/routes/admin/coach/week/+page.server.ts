import { getDb } from '$lib/server/db';
import { getWeekAdherence } from '$lib/server/db/coach';
import { addDays, todayCentral, weekStart } from '$lib/server/date';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, url }) => {
	const db = getDb(platform!.env.DB);
	const requested = url.searchParams.get('start');
	// Normalize any requested date onto its Monday so prev/next links stay aligned.
	const start = weekStart(requested ?? todayCentral());
	const week = await getWeekAdherence(db, start);
	return {
		week,
		today: todayCentral(),
		prevStart: addDays(start, -7),
		nextStart: addDays(start, 7)
	};
};
