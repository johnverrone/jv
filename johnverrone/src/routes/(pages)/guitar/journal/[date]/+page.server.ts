import { error } from '@sveltejs/kit';
import { getJournalEntry } from '$lib/guitar/api';

export async function load({ fetch, params, platform }) {
	const entry = await getJournalEntry(fetch, params.date, platform?.env?.HOBBIES);
	if (!entry) {
		error(404, 'Journal entry not found');
	}
	return { entry };
}
