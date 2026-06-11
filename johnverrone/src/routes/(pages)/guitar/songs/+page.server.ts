import { getSongs } from '$lib/guitar/api';

export async function load({ fetch, platform }) {
	const songs = await getSongs(fetch, platform?.env?.HOBBIES);
	return { songs };
}
