import { getDb } from '$lib/server/db';
import { getPlan } from '$lib/server/db/guitar';

export async function load({ platform }) {
	const db = getDb(platform!.env.DB);
	return { plan: await getPlan(db) };
}
