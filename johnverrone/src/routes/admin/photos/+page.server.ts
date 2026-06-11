import { error, fail } from '@sveltejs/kit';
import { listKeys, putObject, deleteObject, imageKey } from '$lib/server/media';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const keys = await listKeys(platform!.env.PHOTOS);
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
		const key = await putObject(
			platform!.env.PHOTOS,
			imageKey(file.name),
			await file.arrayBuffer(),
			file.type || 'image/jpeg'
		);
		return { uploaded: key };
	},

	delete: async ({ request, locals, platform }) => {
		if (!locals.authenticated) error(403, 'Unauthorized');
		const key = String((await request.formData()).get('key') ?? '');
		if (!key) return fail(400, { error: 'No key.' });
		await deleteObject(platform!.env.PHOTOS, key);
		return { success: true };
	}
};
