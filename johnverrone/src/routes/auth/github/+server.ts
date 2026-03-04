import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const state = crypto.randomUUID();
	cookies.set('github_oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 600
	});

	const params = new URLSearchParams({
		client_id: env.GITHUB_CLIENT_ID!,
		scope: 'repo',
		state
	});

	redirect(302, `https://github.com/login/oauth/authorize?${params}`);
};
