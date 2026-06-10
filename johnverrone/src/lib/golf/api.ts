import { HOBBIES_API_BASE } from '$lib/api/base';
import type { GolfRound } from './types';

const API_BASE = `${HOBBIES_API_BASE}/golf`;

export async function getRounds(fetch: typeof globalThis.fetch): Promise<GolfRound[]> {
	const res = await fetch(`${API_BASE}/rounds`);
	if (!res.ok) throw new Error('Failed to fetch golf rounds');
	const { rounds } = await res.json();
	return rounds;
}
