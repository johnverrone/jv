import { error, fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { listSongs, createSong, updateSong, deleteSong } from '$lib/server/db/guitar';
import { str } from '$lib/server/form';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);
	return { songs: await listSongs(db) };
};

function requireAuth(authenticated: boolean | undefined) {
	if (!authenticated) error(403, 'Unauthorized');
}

const int = (v: FormDataEntryValue | null) => {
	const n = Number(str(v));
	return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

function songInput(form: FormData) {
	const title = str(form.get('title'));
	const artist = str(form.get('artist'));
	const difficulty = str(form.get('difficulty'));
	const genre = str(form.get('genre'));
	const key = str(form.get('key'));
	const tuning = str(form.get('tuning'));
	const bpm = int(form.get('bpm'));
	if (
		!title ||
		!artist ||
		!genre ||
		!key ||
		!tuning ||
		!bpm ||
		(difficulty !== 'Beginner' && difficulty !== 'Intermediate' && difficulty !== 'Advanced')
	) {
		return null;
	}
	return {
		title,
		artist,
		difficulty,
		genre,
		key,
		tuning,
		bpm,
		capo: int(form.get('capo')),
		progress: str(form.get('progress')) ?? 'Not Started',
		tabLink: str(form.get('tab_link')),
		notes: str(form.get('notes')),
		sortOrder: int(form.get('sort_order')) ?? 0
	};
}

export const actions: Actions = {
	create: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const input = songInput(await request.formData());
		if (!input)
			return fail(400, {
				error: 'Title, artist, difficulty, genre, key, tuning, and bpm are required.'
			});
		await createSong(getDb(platform!.env.DB), input);
		return { success: true };
	},

	update: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const form = await request.formData();
		const id = Number(form.get('id'));
		const input = songInput(form);
		if (!id || !input)
			return fail(400, {
				error: 'Title, artist, difficulty, genre, key, tuning, and bpm are required.'
			});
		await updateSong(getDb(platform!.env.DB), id, input);
		return { success: true };
	},

	delete: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const id = Number((await request.formData()).get('id'));
		if (id) await deleteSong(getDb(platform!.env.DB), id);
		return { success: true };
	}
};
