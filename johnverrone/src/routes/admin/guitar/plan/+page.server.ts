import { error, fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { getPlan, setPlan } from '$lib/server/db/guitar';
import { str } from '$lib/server/form';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);
	return { plan: await getPlan(db) };
};

function requireAuth(authenticated: boolean | undefined) {
	if (!authenticated) error(403, 'Unauthorized');
}

export const actions: Actions = {
	save: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const content = str((await request.formData()).get('content'));
		if (!content) return fail(400, { error: 'Plan content is required.' });
		await setPlan(getDb(platform!.env.DB), content);
		return { success: true };
	}
};
