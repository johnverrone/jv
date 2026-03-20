import { getJournalEntries } from '$lib/guitar/api';

export async function load({ fetch }) {
	const entries = await getJournalEntries(fetch);
	return { entries };
}
