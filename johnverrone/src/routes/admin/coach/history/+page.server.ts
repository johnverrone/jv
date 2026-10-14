import { error } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { deleteWorkoutLog, listWorkoutLogs } from '$lib/server/db/coach';
import type { Actions, PageServerLoad } from './$types';

const PAGE_SIZE = 30;

export const load: PageServerLoad = async ({ platform, url }) => {
	const db = getDb(platform!.env.DB);
	const page = Math.max(Number(url.searchParams.get('page')) || 1, 1);
	const workouts = await listWorkoutLogs(db, {
		limit: PAGE_SIZE + 1, // one extra to know whether a next page exists
		offset: (page - 1) * PAGE_SIZE
	});
	const hasMore = workouts.length > PAGE_SIZE;
	const rows = workouts.slice(0, PAGE_SIZE);

	return { workouts: rows, page, hasMore };
};

function requireAuth(authenticated: boolean | undefined) {
	if (!authenticated) error(403, 'Unauthorized');
}

export const actions: Actions = {
	deleteLog: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const id = Number((await request.formData()).get('id'));
		if (id) await deleteWorkoutLog(getDb(platform!.env.DB), id);
		return { success: true };
	}
};
