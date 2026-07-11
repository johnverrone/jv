import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { saveOAuthToken } from '$lib/server/db/integrations';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies, platform }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('strava_oauth_state');

	cookies.delete('strava_oauth_state', { path: '/' });

	if (!code || !state || state !== storedState) {
		error(400, 'Invalid OAuth state');
	}

	const tokenRes = await fetch('https://www.strava.com/oauth/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: env.STRAVA_CLIENT_ID!,
			client_secret: env.STRAVA_CLIENT_SECRET!,
			code,
			grant_type: 'authorization_code'
		})
	});
	if (!tokenRes.ok) error(400, 'Failed to exchange Strava code');

	const data = (await tokenRes.json()) as {
		access_token: string;
		refresh_token: string;
		expires_at: number;
		athlete?: { id: number };
	};

	await saveOAuthToken(getDb(platform!.env.DB), {
		provider: 'strava',
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		expiresAt: data.expires_at,
		athleteId: data.athlete ? String(data.athlete.id) : null,
		scopes: 'activity:read_all'
	});

	redirect(302, '/admin/coach/sync');
};
