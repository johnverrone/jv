import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

/**
 * Single guard for the authenticated command-center section. Everything under
 * the `(app)` route group requires auth; child loads can assume the user is
 * authenticated. In dev, `hooks.server.ts` auto-authenticates, so this is a
 * no-op locally.
 */
export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.authenticated) {
		redirect(302, `/auth/github?redirect=${encodeURIComponent(url.pathname + url.search)}`);
	}

	return { user: { login: 'johnverrone' } };
};
