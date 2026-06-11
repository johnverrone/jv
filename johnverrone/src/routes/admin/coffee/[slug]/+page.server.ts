import { error, fail, redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
	getBeanBySlug,
	updateBean,
	deleteBean,
	publishBean,
	unpublishBean,
	listRoasters
} from '$lib/server/db/coffee';
import { putObject, imageKey } from '$lib/server/media';
import { str, centsFromDollars } from '$lib/server/form';
import type { Actions, PageServerLoad } from './$types';

const csv = (v: FormDataEntryValue | null) =>
	String(v ?? '')
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);

function requireAuth(authenticated: boolean | undefined) {
	if (!authenticated) error(403, 'Unauthorized');
}

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = getDb(platform!.env.DB);
	const bean = await getBeanBySlug(db, params.slug);
	if (!bean) error(404, 'Bean not found');
	return { bean, roasters: await listRoasters(db) };
};

export const actions: Actions = {
	update: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const id = Number(form.get('id'));
		const name = str(form.get('name'));
		const roasterSlug = str(form.get('roaster'));
		if (!id || !name || !roasterSlug) return fail(400, { error: 'Name and roaster are required.' });
		const ratingStr = str(form.get('rating'));
		await updateBean(db, id, {
			name,
			roasterSlug,
			rating: ratingStr ? Number(ratingStr) : null,
			origins: csv(form.get('origins')),
			flavors: csv(form.get('flavors')),
			process: str(form.get('process')),
			singleOrigin: form.get('single_origin') === 'on',
			currentlyBrewing: form.get('currently_brewing') === 'on',
			price12ozCents: centsFromDollars(form.get('price_12oz')),
			notes: str(form.get('notes'))
		});
		return { success: true };
	},

	uploadImage: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const id = Number(form.get('id'));
		const file = form.get('image');
		if (!id || !(file instanceof File) || file.size === 0) {
			return fail(400, { error: 'No image provided.' });
		}
		const key = await putObject(
			platform!.env.COFFEE,
			imageKey(file.name),
			await file.arrayBuffer(),
			file.type || 'image/jpeg'
		);
		await updateBean(db, id, { imageKey: key });
		return { success: true };
	},

	publish: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const id = Number((await request.formData()).get('id'));
		if (id) await publishBean(getDb(platform!.env.DB), id);
		return { success: true };
	},

	unpublish: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const id = Number((await request.formData()).get('id'));
		if (id) await unpublishBean(getDb(platform!.env.DB), id);
		return { success: true };
	},

	deleteBean: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const id = Number((await request.formData()).get('id'));
		if (id) await deleteBean(getDb(platform!.env.DB), id);
		redirect(303, '/admin/coffee');
	}
};
