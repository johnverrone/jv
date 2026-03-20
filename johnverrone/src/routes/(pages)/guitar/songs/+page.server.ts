import { getSongs } from '$lib/guitar/api';

export async function load({ fetch }) {
	const songs = await getSongs(fetch);
	return { songs };
}
