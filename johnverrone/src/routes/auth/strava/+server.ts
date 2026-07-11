import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/** Kick off the Strava OAuth flow (admin-only; single athlete). */
export const GET: RequestHandler = async ({ cookies, locals, url }) => {
	if (!locals.authenticated) error(403, 'Unauthorized');
	if (!env.STRAVA_CLIENT_ID) error(500, 'STRAVA_CLIENT_ID is not configured');

	const state = crypto.randomUUID();
	cookies.set('strava_oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 600
	});

	const params = new URLSearchParams({
		client_id: env.STRAVA_CLIENT_ID,
		redirect_uri: `${url.origin}/auth/strava/callback`,
		response_type: 'code',
		scope: 'activity:read_all',
		state
	});

	redirect(302, `https://www.strava.com/oauth/authorize?${params}`);
};
