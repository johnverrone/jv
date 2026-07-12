import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { listSongs, createSong, updateSong, deleteSong } from '$lib/server/db/guitar';
import { requireApiToken } from '$lib/server/api/auth';
import type { RequestHandler } from './$types';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

/** The song list. */
export const GET: RequestHandler = async ({ request, platform }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;
	return json(await listSongs(getDb(platform!.env.DB)));
};

type Body = {
	id?: number;
	delete?: boolean;
	title?: string;
	artist?: string;
	difficulty?: string;
	genre?: string;
	key?: string;
	tuning?: string;
	bpm?: number;
	capo?: number | null;
	progress?: string;
	tab_link?: string | null;
	notes?: string | null;
	sort_order?: number;
};

function patchFrom(body: Body) {
	const patch: Record<string, unknown> = {};
	if (body.title !== undefined) patch.title = body.title;
	if (body.artist !== undefined) patch.artist = body.artist;
	if (body.difficulty !== undefined) {
		const difficulty = DIFFICULTIES.find((d) => d === body.difficulty);
		if (!difficulty) return { error: `difficulty must be one of: ${DIFFICULTIES.join(', ')}` };
		patch.difficulty = difficulty;
	}
	if (body.genre !== undefined) patch.genre = body.genre;
	if (body.key !== undefined) patch.key = body.key;
	if (body.tuning !== undefined) patch.tuning = body.tuning;
	if (body.bpm !== undefined) patch.bpm = body.bpm;
	if (body.capo !== undefined) patch.capo = body.capo;
	if (body.progress !== undefined) patch.progress = body.progress;
	if (body.tab_link !== undefined) patch.tabLink = body.tab_link;
	if (body.notes !== undefined) patch.notes = body.notes;
	if (body.sort_order !== undefined) patch.sortOrder = body.sort_order;
	return { patch };
}

/**
 * `{id, delete: true}` removes a song; `{id, ...fields}` patches one;
 * `{title, artist, difficulty, genre, key, tuning, bpm, ...}` without an id
 * creates one.
 */
export const POST: RequestHandler = async ({ request, platform }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;

	let body: Body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Body must be JSON' }, { status: 400 });
	}

	const db = getDb(platform!.env.DB);

	if (body.id && body.delete) {
		await deleteSong(db, body.id);
		return json({ deleted: body.id });
	}

	const result = patchFrom(body);
	if ('error' in result) return json({ error: result.error }, { status: 400 });
	const { patch } = result;

	if (body.id) {
		const updated = await updateSong(db, body.id, patch);
		if (!updated) return json({ error: `No song with id ${body.id}` }, { status: 404 });
		return json(updated);
	}

	if (
		!patch.title ||
		!patch.artist ||
		!patch.difficulty ||
		!patch.genre ||
		!patch.key ||
		!patch.tuning ||
		!patch.bpm
	) {
		return json(
			{ error: 'Creating a song requires title, artist, difficulty, genre, key, tuning, and bpm' },
			{ status: 400 }
		);
	}
	const created = await createSong(db, patch as Parameters<typeof createSong>[1]);
	return json(created, { status: 201 });
};
