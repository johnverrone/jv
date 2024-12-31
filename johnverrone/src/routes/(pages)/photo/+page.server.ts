import storage from '$lib/storage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [files] = await storage.bucket('johnverrone').getFiles({
		prefix: 'portfolio-photos/'
	});

	const sorted = files
		.filter((f) => f.name.endsWith('.jpg'))
		.sort((a, b) => b.name.localeCompare(a.name));

	const photos = sorted.map((f) => {
		return `https://storage.googleapis.com/${f.cloudStorageURI.hostname}${f.cloudStorageURI.pathname}`;
	});

	return {
		photos
	};
};
