import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
	if (dev) {
		event.locals.authenticated = true;
		event.locals.githubToken = 'dev-token';
	} else {
		const token = event.cookies.get('github_token');
		if (token) {
			event.locals.authenticated = true;
			event.locals.githubToken = token;
		}
	}
	return resolve(event);
};
