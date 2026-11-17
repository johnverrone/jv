import { env } from '$env/dynamic/private';
import { error, fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { getOAuthToken, deleteOAuthToken, type Provider } from '$lib/server/db/integrations';
import { clampSyncDays, syncIntegrations } from '$lib/server/integrations/sync';
import { str } from '$lib/server/form';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);
	const [strava, whoop] = await Promise.all([
		getOAuthToken(db, 'strava'),
		getOAuthToken(db, 'whoop')
	]);
	const status = (token: typeof strava) =>
		token
			? { connected: true as const, athleteId: token.athleteId, lastSyncedAt: token.lastSyncedAt }
			: { connected: false as const, athleteId: null, lastSyncedAt: null };
	return {
		strava: status(strava),
		whoop: status(whoop),
		configured: {
			strava: Boolean(env.STRAVA_CLIENT_ID && env.STRAVA_CLIENT_SECRET),
			whoop: Boolean(env.WHOOP_CLIENT_ID && env.WHOOP_CLIENT_SECRET)
		}
	};
};

function requireAuth(authenticated: boolean | undefined) {
	if (!authenticated) error(403, 'Unauthorized');
}

export const actions: Actions = {
	sync: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const days = clampSyncDays(str((await request.formData()).get('days')));
		const result = await syncIntegrations(getDb(platform!.env.DB), env, days);
		if (!result.ok) return fail(result.status, { error: result.error });
		return { strava: result.strava, whoop: result.whoop, error: result.error };
	},

	disconnect: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const provider = str((await request.formData()).get('provider'));
		if (provider !== 'strava' && provider !== 'whoop')
			return fail(400, { error: 'Unknown provider.' });
		await deleteOAuthToken(getDb(platform!.env.DB), provider as Provider);
		return { success: true };
	}
};
