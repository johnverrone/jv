import { getPlan } from '$lib/guitar/api';

export async function load({ fetch, platform }) {
	const plan = await getPlan(fetch, platform?.env?.HOBBIES);
	return { plan };
}
