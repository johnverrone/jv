import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getDb } from '$lib/server/db';
import { requireApiToken } from '$lib/server/api/auth';
import { clampSyncDays, syncIntegrations } from '$lib/server/integrations/sync';
import type { RequestHandler } from './$types';

/**
 * Pull recent Strava + Whoop data into the coach tables — the same sync as the
 * button on /admin/coach/sync, exposed for agents (command-center-mcp's
 * `coach_sync` tool). Body (optional): { days?: number } — 1..90, default 14.
 *
 * Partial success (one provider failed) is still 200, with `error` set.
 */
export const POST: RequestHandler = async ({ request, platform }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;

	let body: { days?: unknown } = {};
	const raw = await request.text();
	if (raw.trim()) {
		try {
			body = JSON.parse(raw);
		} catch {
			return json({ error: 'Body must be JSON' }, { status: 400 });
		}
	}

	const days = clampSyncDays(body.days);
	const result = await syncIntegrations(getDb(platform!.env.DB), env, days);
	if (!result.ok) return json({ error: result.error }, { status: result.status });

	const { strava, whoop, error } = result;
	return json({ days, strava, whoop, error });
};
