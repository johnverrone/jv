import { error, fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
	listPlanSessions,
	createPlanSession,
	updatePlanSession,
	deletePlanSession,
	seedDefaultPlan
} from '$lib/server/db/coach';
import { MODALITIES } from '$lib/server/db/schema';
import { str } from '$lib/server/form';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);
	return { sessions: await listPlanSessions(db) };
};

function requireAuth(authenticated: boolean | undefined) {
	if (!authenticated) error(403, 'Unauthorized');
}

const int = (v: FormDataEntryValue | null) => {
	const n = Number(str(v));
	return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

function sessionInput(form: FormData) {
	const name = str(form.get('name'));
	const modality = MODALITIES.find((m) => m === str(form.get('modality')));
	const dayOfWeek = Number(str(form.get('day_of_week')));
	if (!name || !modality || !(dayOfWeek >= 0 && dayOfWeek <= 6)) return null;
	return {
		name,
		modality,
		dayOfWeek,
		sortOrder: int(form.get('sort_order')) ?? 0,
		durationMin: int(form.get('duration_min')),
		prescription: str(form.get('prescription')),
		bareMin: str(form.get('bare_min')),
		bareMinDurationMin: int(form.get('bare_min_duration_min')),
		active: form.get('active') === 'on'
	};
}

export const actions: Actions = {
	seed: async ({ locals, platform }) => {
		requireAuth(locals.authenticated);
		await seedDefaultPlan(getDb(platform!.env.DB));
		return { success: true };
	},

	create: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const input = sessionInput(await request.formData());
		if (!input) return fail(400, { error: 'Name, modality, and day are required.' });
		await createPlanSession(getDb(platform!.env.DB), input);
		return { success: true };
	},

	update: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const form = await request.formData();
		const id = Number(form.get('id'));
		const input = sessionInput(form);
		if (!id || !input) return fail(400, { error: 'Name, modality, and day are required.' });
		await updatePlanSession(getDb(platform!.env.DB), id, input);
		return { success: true };
	},

	delete: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const id = Number((await request.formData()).get('id'));
		if (id) await deletePlanSession(getDb(platform!.env.DB), id);
		return { success: true };
	}
};
