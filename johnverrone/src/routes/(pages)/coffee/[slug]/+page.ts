import type { PageLoad } from './$types';
import { coffeeQuery, type CoffeeResult } from '$lib/queries';
import { client } from '$lib/sanity';

export const load: PageLoad = async ({ params }) => {
	const coffeeParams = { slug: params.slug };
	const coffee = await client.fetch<CoffeeResult>(coffeeQuery, coffeeParams);

	return {
		coffee
	};
};
