import { listPhotos } from '$lib/server/media';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const keys = await listPhotos(platform!.env.MEDIA);
	return { keys };
};
