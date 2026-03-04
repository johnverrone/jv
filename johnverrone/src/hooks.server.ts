import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('github_token');
	if (token) {
		event.locals.authenticated = true;
		event.locals.githubToken = token;
	}
	return resolve(event);
};
