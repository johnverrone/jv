import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url }) => {
	const state = crypto.randomUUID();
	cookies.set('github_oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 600
	});

	// Remember where the user was headed so the callback can return them there.
	// Only allow internal paths to avoid an open redirect.
	const redirectTo = url.searchParams.get('redirect');
	if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
		cookies.set('github_oauth_redirect', redirectTo, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 600
		});
	}

	const params = new URLSearchParams({
		client_id: env.GITHUB_CLIENT_ID!,
		scope: 'repo',
		state
	});

	redirect(302, `https://github.com/login/oauth/authorize?${params}`);
};
