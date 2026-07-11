import { error, fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
	listJournalEntries,
	createJournalEntry,
	updateJournalEntry,
	deleteJournalEntry
} from '$lib/server/db/guitar';
import { str } from '$lib/server/form';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);
	return { entries: await listJournalEntries(db) };
};

function requireAuth(authenticated: boolean | undefined) {
	if (!authenticated) error(403, 'Unauthorized');
}

function entryInput(form: FormData) {
	const date = str(form.get('date'));
	const theme = str(form.get('theme'));
	const content = str(form.get('content'));
	const durationMin = Number(str(form.get('duration_min')));
	if (!date || !theme || !content || !Number.isFinite(durationMin) || durationMin <= 0) {
		return null;
	}
	return { date, theme, content, durationMin: Math.round(durationMin) };
}

export const actions: Actions = {
	create: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const input = entryInput(await request.formData());
		if (!input) return fail(400, { error: 'Date, duration, theme, and content are required.' });
		try {
			await createJournalEntry(getDb(platform!.env.DB), input);
		} catch (e) {
			if (String(e).includes('UNIQUE')) {
				return fail(409, { error: 'An entry for that date already exists.' });
			}
			throw e;
		}
		return { success: true };
	},

	update: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const form = await request.formData();
		const id = Number(form.get('id'));
		const input = entryInput(form);
		if (!id || !input)
			return fail(400, { error: 'Date, duration, theme, and content are required.' });
		await updateJournalEntry(getDb(platform!.env.DB), id, input);
		return { success: true };
	},

	delete: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const id = Number((await request.formData()).get('id'));
		if (id) await deleteJournalEntry(getDb(platform!.env.DB), id);
		return { success: true };
	}
};
