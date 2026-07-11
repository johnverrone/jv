import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import { WHOOP_AUTH_URL, WHOOP_SCOPES } from '$lib/server/integrations/whoop';
import type { RequestHandler } from './$types';

/** Kick off the Whoop OAuth flow (admin-only; single user). */
export const GET: RequestHandler = async ({ cookies, locals, url }) => {
	if (!locals.authenticated) error(403, 'Unauthorized');
	if (!env.WHOOP_CLIENT_ID) error(500, 'WHOOP_CLIENT_ID is not configured');

	const state = crypto.randomUUID();
	cookies.set('whoop_oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 600
	});

	const params = new URLSearchParams({
		client_id: env.WHOOP_CLIENT_ID,
		redirect_uri: `${url.origin}/auth/whoop/callback`,
		response_type: 'code',
		scope: WHOOP_SCOPES,
		state
	});

	redirect(302, `${WHOOP_AUTH_URL}?${params}`);
};
