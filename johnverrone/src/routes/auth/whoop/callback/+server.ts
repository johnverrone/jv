import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { saveOAuthToken } from '$lib/server/db/integrations';
import { WHOOP_TOKEN_URL, WHOOP_SCOPES } from '$lib/server/integrations/whoop';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies, platform }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('whoop_oauth_state');

	cookies.delete('whoop_oauth_state', { path: '/' });

	if (!code || !state || state !== storedState) {
		error(400, 'Invalid OAuth state');
	}

	const tokenRes = await fetch(WHOOP_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: env.WHOOP_CLIENT_ID!,
			client_secret: env.WHOOP_CLIENT_SECRET!,
			code,
			grant_type: 'authorization_code',
			redirect_uri: `${url.origin}/auth/whoop/callback`
		})
	});
	if (!tokenRes.ok) error(400, 'Failed to exchange Whoop code');

	const data = (await tokenRes.json()) as {
		access_token: string;
		refresh_token: string;
		expires_in: number;
	};

	await saveOAuthToken(getDb(platform!.env.DB), {
		provider: 'whoop',
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
		athleteId: null,
		scopes: WHOOP_SCOPES
	});

	redirect(302, '/admin/coach/sync');
};
