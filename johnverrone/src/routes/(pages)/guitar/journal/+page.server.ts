import { getJournalEntries } from '$lib/guitar/api';

export async function load({ fetch, platform }) {
	const entries = await getJournalEntries(fetch, platform?.env?.HOBBIES);
	return { entries };
}
