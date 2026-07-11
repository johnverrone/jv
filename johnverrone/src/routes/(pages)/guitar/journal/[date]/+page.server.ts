import { error } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { getJournalEntry } from '$lib/server/db/guitar';

export async function load({ params, platform }) {
	const db = getDb(platform!.env.DB);
	const entry = await getJournalEntry(db, params.date);
	if (!entry) error(404, 'Journal entry not found');
	return { entry };
}
