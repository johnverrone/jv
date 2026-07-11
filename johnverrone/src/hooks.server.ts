import { redirect, type Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
	// Force HTTPS before anything else runs. The `secure` OAuth-state cookies
	// are silently dropped by the browser on an http:// hop (set or send), which
	// surfaces downstream as a confusing "Invalid OAuth state" error.
	if (!dev && event.url.protocol === 'http:') {
		const httpsUrl = new URL(event.url);
		httpsUrl.protocol = 'https:';
		redirect(301, httpsUrl.toString());
	}

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
