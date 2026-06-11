import { listKeys } from '$lib/server/media';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const keys = await listKeys(platform!.env.PHOTOS);
	return { keys };
};
