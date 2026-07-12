import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
	listJournalEntries,
	getJournalEntry,
	createJournalEntry,
	updateJournalEntry,
	deleteJournalEntry
} from '$lib/server/db/guitar';
import { requireApiToken } from '$lib/server/api/auth';
import { isUniqueConstraintError } from '$lib/server/db/errors';
import type { RequestHandler } from './$types';

/** The journal — optionally a single date via ?date=yyyy-mm-dd. */
export const GET: RequestHandler = async ({ request, platform, url }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;

	const db = getDb(platform!.env.DB);
	const date = url.searchParams.get('date');
	if (date) {
		const entry = await getJournalEntry(db, date);
		if (!entry) return json({ error: `No journal entry for ${date}` }, { status: 404 });
		return json(entry);
	}
	return json(await listJournalEntries(db));
};

type Body = {
	id?: number;
	delete?: boolean;
	date?: string;
	duration_min?: number;
	theme?: string;
	content?: string;
};

/**
 * `{id, delete: true}` removes an entry; `{id, ...fields}` patches one;
 * `{date, duration_min, theme, content}` without an id creates one.
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
		await deleteJournalEntry(db, body.id);
		return json({ deleted: body.id });
	}

	const patch: Record<string, unknown> = {};
	if (body.date) patch.date = body.date;
	if (body.duration_min !== undefined) patch.durationMin = body.duration_min;
	if (body.theme !== undefined) patch.theme = body.theme;
	if (body.content !== undefined) patch.content = body.content;

	if (body.id) {
		const updated = await updateJournalEntry(db, body.id, patch);
		if (!updated) return json({ error: `No journal entry with id ${body.id}` }, { status: 404 });
		return json(updated);
	}

	if (!patch.date || !patch.durationMin || !patch.theme || !patch.content) {
		return json(
			{ error: 'Creating an entry requires date, duration_min, theme, and content' },
			{ status: 400 }
		);
	}
	try {
		const created = await createJournalEntry(db, patch as Parameters<typeof createJournalEntry>[1]);
		return json(created, { status: 201 });
	} catch (e) {
		if (isUniqueConstraintError(e)) {
			return json({ error: `An entry for ${patch.date} already exists` }, { status: 409 });
		}
		throw e;
	}
};
