import { env } from '$env/dynamic/private';
import { error, fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { getOAuthToken, deleteOAuthToken, type Provider } from '$lib/server/db/integrations';
import { syncStrava, type ImportResult } from '$lib/server/integrations/strava';
import { syncWhoop, type WhoopImportResult } from '$lib/server/integrations/whoop';
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

const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

export const actions: Actions = {
	sync: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const db = getDb(platform!.env.DB);
		const days = syncDays(await request.formData());
		const [stravaToken, whoopToken] = await Promise.all([
			getOAuthToken(db, 'strava'),
			getOAuthToken(db, 'whoop')
		]);

		const stravaReady = Boolean(stravaToken && env.STRAVA_CLIENT_ID && env.STRAVA_CLIENT_SECRET);
		const whoopReady = Boolean(whoopToken && env.WHOOP_CLIENT_ID && env.WHOOP_CLIENT_SECRET);
		if (!stravaReady && !whoopReady) {
			return fail(400, { error: 'No integrations are connected.' });
		}

		let strava: ImportResult | null = null;
		let whoop: WhoopImportResult | null = null;
		const errors: string[] = [];

		// Whoop first: Strava wins when both saw a workout, so its import gets the
		// last word and can replace the Whoop-logged version.
		if (whoopReady) {
			try {
				whoop = await syncWhoop(
					db,
					{ clientId: env.WHOOP_CLIENT_ID!, clientSecret: env.WHOOP_CLIENT_SECRET! },
					days
				);
			} catch (e) {
				errors.push(`Whoop sync failed: ${message(e)}`);
			}
		}
		if (stravaReady) {
			try {
				strava = await syncStrava(
					db,
					{ clientId: env.STRAVA_CLIENT_ID!, clientSecret: env.STRAVA_CLIENT_SECRET! },
					days
				);
			} catch (e) {
				errors.push(`Strava sync failed: ${message(e)}`);
			}
		}

		if (errors.length && !strava && !whoop) return fail(502, { error: errors.join(' · ') });
		return { strava, whoop, error: errors.length ? errors.join(' · ') : null };
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
