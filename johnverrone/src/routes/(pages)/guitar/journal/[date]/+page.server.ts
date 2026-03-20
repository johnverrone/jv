import { error } from '@sveltejs/kit';
import { getJournalEntry } from '$lib/guitar/api';

export async function load({ fetch, params }) {
	const entry = await getJournalEntry(fetch, params.date);
	if (!entry) {
		error(404, 'Journal entry not found');
	}
	return { entry };
}
