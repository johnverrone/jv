import { getDb } from '$lib/server/db';
import { listBeans, listRoasters } from '$lib/server/db/coffee';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, locals }) => {
	const db = getDb(platform!.env.DB);
	const [beans, roasters] = await Promise.all([
		listBeans(db, { publishedOnly: true }),
		listRoasters(db)
	]);
	return {
		beans,
		roastersBySlug: new Map(roasters.map((r) => [r.slug, r])),
		authenticated: locals.authenticated ?? false
	};
};
