import { getAllBeans, getAllRoasters } from '$lib/coffee/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [beans, roasters] = await Promise.all([getAllBeans(), getAllRoasters()]);

	const roastersBySlug = new Map(roasters.map((r) => [r.slug, r]));

	return {
		beans,
		roastersBySlug,
		authenticated: locals.authenticated ?? false
	};
};
