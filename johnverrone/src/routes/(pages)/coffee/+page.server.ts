import { getAllCoffeeBrews } from '$lib/coffee/brews';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const coffees = await getAllCoffeeBrews();

	return {
		coffees
	};
};
