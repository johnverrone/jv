import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url }) => {
	// Reuse an in-flight state rather than minting a new one on every hit, so a
	// duplicate request (double tap, mobile network retry) can't invalidate a
	// login that's already underway by overwriting the cookie GitHub will echo back.
	const state = cookies.get('github_oauth_state') ?? crypto.randomUUID();
	cookies.set('github_oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 900
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
		scope: 'read:user',
		state
	});

	redirect(302, `https://github.com/login/oauth/authorize?${params}`);
};
