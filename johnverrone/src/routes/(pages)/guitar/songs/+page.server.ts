import { getDb } from '$lib/server/db';
import { listSongs } from '$lib/server/db/guitar';

export async function load({ platform }) {
	const db = getDb(platform!.env.DB);
	return { songs: await listSongs(db) };
}
