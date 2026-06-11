import { dev } from '$app/environment';
import { HOBBIES_API_BASE } from '$lib/api/base';
import type { Fetcher } from '@cloudflare/workers-types';

/**
 * Fetch a /guitar path from the legacy hobbies Worker. In production the deployed
 * Worker can't reach the hobbies Worker over its public workers.dev URL
 * (same-subdomain subrequests are blocked), so we go through the HOBBIES service
 * binding. In dev there's no binding, so use the public URL directly. (Goes away
 * when guitar moves to D1.)
 */
function hobbiesGet(path: string, fetch: typeof globalThis.fetch, hobbies?: Fetcher) {
	return !dev && hobbies
		? hobbies.fetch(new Request(`https://hobbies/guitar${path}`))
		: fetch(`${HOBBIES_API_BASE}/guitar${path}`);
}

export async function getJournalEntries(fetch: typeof globalThis.fetch, hobbies?: Fetcher) {
	const res = await hobbiesGet('/journal', fetch, hobbies);
	if (!res.ok) throw new Error('Failed to fetch journal entries');
	const { entries } = await res.json();
	return entries;
}

export async function getJournalEntry(fetch: typeof globalThis.fetch, date: string, hobbies?: Fetcher) {
	const res = await hobbiesGet(`/journal/${date}`, fetch, hobbies);
	if (!res.ok) return null;
	return res.json();
}

export async function getPlan(fetch: typeof globalThis.fetch, hobbies?: Fetcher) {
	const res = await hobbiesGet('/plan', fetch, hobbies);
	if (!res.ok) throw new Error('Failed to fetch practice plan');
	const { content } = await res.json();
	return content;
}

export async function getSongs(fetch: typeof globalThis.fetch, hobbies?: Fetcher) {
	const res = await hobbiesGet('/songs', fetch, hobbies);
	if (!res.ok) throw new Error('Failed to fetch songs');
	const { songs } = await res.json();
	return songs;
}
