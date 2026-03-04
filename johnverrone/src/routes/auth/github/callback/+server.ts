import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('github_oauth_state');

	cookies.delete('github_oauth_state', { path: '/' });

	if (!code || !state || state !== storedState) {
		error(400, 'Invalid OAuth state');
	}

	const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({
			client_id: env.GITHUB_CLIENT_ID,
			client_secret: env.GITHUB_CLIENT_SECRET,
			code
		})
	});

	const tokenData = await tokenRes.json();
	if (!tokenData.access_token) {
		error(400, 'Failed to get access token');
	}

	const userRes = await fetch('https://api.github.com/user', {
		headers: { Authorization: `Bearer ${tokenData.access_token}` }
	});
	const user = await userRes.json();

	if (user.login !== 'johnverrone') {
		error(403, 'Unauthorized');
	}

	cookies.set('github_token', tokenData.access_token, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7
	});

	redirect(302, '/coffee/new');
};
