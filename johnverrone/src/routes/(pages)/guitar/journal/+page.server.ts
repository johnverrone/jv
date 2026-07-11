import { getDb } from '$lib/server/db';
import { listJournalEntries } from '$lib/server/db/guitar';

export async function load({ platform }) {
	const db = getDb(platform!.env.DB);
	return { entries: await listJournalEntries(db) };
}
