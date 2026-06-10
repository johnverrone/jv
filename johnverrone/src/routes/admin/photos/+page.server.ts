import { error, fail } from '@sveltejs/kit';
import { listPhotos, putPhoto, deletePhoto } from '$lib/server/media';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const keys = await listPhotos(platform!.env.MEDIA);
	return { keys };
};

export const actions: Actions = {
	// Form actions run before layout `load`, so the section auth guard doesn't
	// cover them — check explicitly here.
	upload: async ({ request, locals, platform }) => {
		if (!locals.authenticated) error(403, 'Unauthorized');
		const file = (await request.formData()).get('photo');
		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { error: 'No image provided.' });
		}
		const key = await putPhoto(
			platform!.env.MEDIA,
			await file.arrayBuffer(),
			file.name,
			file.type || 'image/jpeg'
		);
		return { uploaded: key };
	},

	delete: async ({ request, locals, platform }) => {
		if (!locals.authenticated) error(403, 'Unauthorized');
		const key = String((await request.formData()).get('key') ?? '');
		if (!key) return fail(400, { error: 'No key.' });
		await deletePhoto(platform!.env.MEDIA, key);
		return { success: true };
	}
};
