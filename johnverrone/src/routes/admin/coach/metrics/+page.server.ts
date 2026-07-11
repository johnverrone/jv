import { error, fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { addMetric, deleteMetric, latestMetrics, listMetrics } from '$lib/server/db/coach';
import { str } from '$lib/server/form';
import { todayCentral } from '$lib/server/date';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, url }) => {
	const db = getDb(platform!.env.DB);
	const type = url.searchParams.get('type') ?? 'weight_lb';
	const [latest, readings] = await Promise.all([latestMetrics(db), listMetrics(db, type)]);
	return { latest, readings, type };
};

function requireAuth(authenticated: boolean | undefined) {
	if (!authenticated) error(403, 'Unauthorized');
}

export const actions: Actions = {
	add: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const form = await request.formData();
		const type = str(form.get('type'))?.toLowerCase().replace(/\s+/g, '_');
		const value = Number(str(form.get('value')));
		if (!type || !Number.isFinite(value)) {
			return fail(400, { error: 'Type and a numeric value are required.' });
		}
		await addMetric(getDb(platform!.env.DB), {
			date: str(form.get('date')) ?? todayCentral(),
			type,
			value,
			notes: str(form.get('notes'))
		});
		return { success: true };
	},

	delete: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const id = Number((await request.formData()).get('id'));
		if (id) await deleteMetric(getDb(platform!.env.DB), id);
		return { success: true };
	}
};
