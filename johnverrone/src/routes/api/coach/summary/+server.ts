import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
	getHabitStreaks,
	getWeekAdherence,
	latestMetrics,
	listCheckIns,
	listWorkoutLogs
} from '$lib/server/db/coach';
import { requireApiToken } from '$lib/server/api/auth';
import { addDays, todayCentral, weekStart } from '$lib/server/date';
import type { RequestHandler } from './$types';

/** Rolling summary for the weekly review agent: adherence, streaks, volume, metrics. */
export const GET: RequestHandler = async ({ request, platform, url }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;

	const db = getDb(platform!.env.DB);
	const today = todayCentral();
	const days = Math.min(Number(url.searchParams.get('days')) || 7, 90);
	const from = addDays(today, -(days - 1));

	const [adherence, streaks, workouts, metrics, checkIns] = await Promise.all([
		getWeekAdherence(db, weekStart(today)),
		getHabitStreaks(db, today),
		listWorkoutLogs(db, { from, to: today, limit: 200 }),
		latestMetrics(db),
		listCheckIns(db, { limit: 10 })
	]);

	// Weekly volume: minutes by modality over the window (bare-min minutes included).
	const volumeMinByModality: Record<string, number> = {};
	for (const log of workouts) {
		if (log.status === 'skipped' || !log.durationMin) continue;
		volumeMinByModality[log.modality] = (volumeMinByModality[log.modality] ?? 0) + log.durationMin;
	}

	return json({
		from,
		to: today,
		weekAdherence: adherence,
		streaks,
		volumeMinByModality,
		recentWorkouts: workouts,
		latestMetrics: metrics,
		recentCheckIns: checkIns
	});
};
