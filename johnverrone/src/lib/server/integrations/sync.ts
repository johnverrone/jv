import type { DB } from '$lib/server/db';
import { getOAuthToken } from '$lib/server/db/integrations';
import { syncStrava, type ImportResult } from './strava';
import { syncWhoop, type WhoopImportResult } from './whoop';

/** Reads STRAVA_/WHOOP_CLIENT_ID and _CLIENT_SECRET — pass `$env/dynamic/private`. */
export type SyncCreds = Record<string, string | undefined>;

export type SyncOutcome =
	| { ok: false; error: string; status: 400 | 502 }
	| {
			ok: true;
			strava: ImportResult | null;
			whoop: WhoopImportResult | null;
			error: string | null;
	  };

/** Clamp a requested lookback window to 1..90 days, defaulting to 14. */
export function clampSyncDays(raw: unknown): number {
	const days = Number(raw);
	return Number.isFinite(days) && days >= 1 ? Math.min(Math.round(days), 90) : 14;
}

const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

/**
 * Pull the last `days` of Strava activities and Whoop cycles/recovery/sleep/
 * workouts into the coach tables. Shared by the admin sync button and
 * POST /api/coach/sync (the MCP `coach_sync` tool).
 *
 * Whoop runs first: Strava wins when both saw a workout, so its import gets
 * the last word and can replace the Whoop-logged version.
 */
export async function syncIntegrations(
	db: DB,
	creds: SyncCreds,
	days: number
): Promise<SyncOutcome> {
	const [stravaToken, whoopToken] = await Promise.all([
		getOAuthToken(db, 'strava'),
		getOAuthToken(db, 'whoop')
	]);

	const stravaReady = Boolean(stravaToken && creds.STRAVA_CLIENT_ID && creds.STRAVA_CLIENT_SECRET);
	const whoopReady = Boolean(whoopToken && creds.WHOOP_CLIENT_ID && creds.WHOOP_CLIENT_SECRET);
	if (!stravaReady && !whoopReady) {
		return { ok: false, error: 'No integrations are connected.', status: 400 };
	}

	let strava: ImportResult | null = null;
	let whoop: WhoopImportResult | null = null;
	const errors: string[] = [];

	if (whoopReady) {
		try {
			whoop = await syncWhoop(
				db,
				{ clientId: creds.WHOOP_CLIENT_ID!, clientSecret: creds.WHOOP_CLIENT_SECRET! },
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
				{ clientId: creds.STRAVA_CLIENT_ID!, clientSecret: creds.STRAVA_CLIENT_SECRET! },
				days
			);
		} catch (e) {
			errors.push(`Strava sync failed: ${message(e)}`);
		}
	}

	if (errors.length && !strava && !whoop) {
		return { ok: false, error: errors.join(' · '), status: 502 };
	}
	return { ok: true, strava, whoop, error: errors.length ? errors.join(' · ') : null };
}
