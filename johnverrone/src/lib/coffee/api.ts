import { HOBBIES_API_BASE } from '$lib/api/base';
import type { CoffeeBean, CoffeeRoaster } from './types';

const API_BASE = `${HOBBIES_API_BASE}/coffee`;

export async function getAllBeans(fetch = globalThis.fetch): Promise<CoffeeBean[]> {
	const response = await fetch(`${API_BASE}/beans`);
	if (!response.ok) throw new Error('Failed to fetch coffee beans');
	return response.json();
}

export async function getAllRoasters(fetch = globalThis.fetch): Promise<CoffeeRoaster[]> {
	const response = await fetch(`${API_BASE}/roasters`);
	if (!response.ok) throw new Error('Failed to fetch roasters');
	return response.json();
}
