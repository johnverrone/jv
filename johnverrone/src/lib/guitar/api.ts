const API_BASE = 'https://hobbies.johnverrone.workers.dev/guitar';

export async function getJournalEntries(fetch: typeof globalThis.fetch) {
	const res = await fetch(`${API_BASE}/journal`);
	if (!res.ok) throw new Error('Failed to fetch journal entries');
	const { entries } = await res.json();
	return entries;
}

export async function getJournalEntry(fetch: typeof globalThis.fetch, date: string) {
	const res = await fetch(`${API_BASE}/journal/${date}`);
	if (!res.ok) return null;
	return res.json();
}

export async function getPlan(fetch: typeof globalThis.fetch) {
	const res = await fetch(`${API_BASE}/plan`);
	if (!res.ok) throw new Error('Failed to fetch practice plan');
	const { content } = await res.json();
	return content;
}

export async function getSongs(fetch: typeof globalThis.fetch) {
	const res = await fetch(`${API_BASE}/songs`);
	if (!res.ok) throw new Error('Failed to fetch songs');
	const { songs } = await res.json();
	return songs;
}
