import type { CoffeeBean, CoffeeRoaster } from './types';

const API_BASE = 'https://hobbies.johnverrone.workers.dev/coffee';

export async function getAllBeans(): Promise<CoffeeBean[]> {
	const response = await fetch(`${API_BASE}/beans`);
	if (!response.ok) throw new Error('Failed to fetch coffee beans');
	return response.json();
}

export async function getAllRoasters(): Promise<CoffeeRoaster[]> {
	const response = await fetch(`${API_BASE}/roasters`);
	if (!response.ok) throw new Error('Failed to fetch roasters');
	return response.json();
}
