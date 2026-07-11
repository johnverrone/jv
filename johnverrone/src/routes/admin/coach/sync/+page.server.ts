import { env } from '$env/dynamic/private';
import { error, fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { getOAuthToken, deleteOAuthToken, type Provider } from '$lib/server/db/integrations';
import { syncStrava } from '$lib/server/integrations/strava';
import { syncWhoop } from '$lib/server/integrations/whoop';
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

const syncDays = (form: FormData) => {
	const days = Number(str(form.get('days')));
	return Number.isFinite(days) && days >= 1 ? Math.min(Math.round(days), 90) : 14;
};

export const actions: Actions = {
	syncStrava: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		if (!env.STRAVA_CLIENT_ID || !env.STRAVA_CLIENT_SECRET) {
			return fail(500, { error: 'Strava credentials are not configured.' });
		}
		try {
			const result = await syncStrava(
				getDb(platform!.env.DB),
				{ clientId: env.STRAVA_CLIENT_ID, clientSecret: env.STRAVA_CLIENT_SECRET },
				syncDays(await request.formData())
			);
			return { strava: result };
		} catch (e) {
			return fail(502, { error: `Strava sync failed: ${e instanceof Error ? e.message : e}` });
		}
	},

	syncWhoop: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		if (!env.WHOOP_CLIENT_ID || !env.WHOOP_CLIENT_SECRET) {
			return fail(500, { error: 'Whoop credentials are not configured.' });
		}
		try {
			const result = await syncWhoop(
				getDb(platform!.env.DB),
				{ clientId: env.WHOOP_CLIENT_ID, clientSecret: env.WHOOP_CLIENT_SECRET },
				syncDays(await request.formData())
			);
			return { whoop: result };
		} catch (e) {
			return fail(502, { error: `Whoop sync failed: ${e instanceof Error ? e.message : e}` });
		}
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
