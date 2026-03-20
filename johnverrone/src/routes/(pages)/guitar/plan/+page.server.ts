import { getPlan } from '$lib/guitar/api';

export async function load({ fetch }) {
	const plan = await getPlan(fetch);
	return { plan };
}
