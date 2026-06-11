import { fail, redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { listGear, createGear } from '$lib/server/db/gear';
import { centsFromDollars, slugify, str } from '$lib/server/form';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);
	const items = await listGear(db);
	return { items };
};

export const actions: Actions = {
	create: async ({ request, platform }) => {
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const name = str(form.get('name'));
		const category = str(form.get('category'));
		if (!name || !category) {
			return fail(400, { error: 'Name and category are required.' });
		}

		let slug: string;
		try {
			const created = await createGear(db, {
				slug: slugify(name),
				name,
				category,
				manufacturer: str(form.get('manufacturer')),
				model: str(form.get('model')),
				serialNumber: str(form.get('serial_number')),
				acquiredDate: str(form.get('acquired_date')),
				acquiredPriceCents: centsFromDollars(form.get('acquired_price')),
				notes: str(form.get('notes')),
				imageUrl: str(form.get('image_url'))
			});
			slug = created.slug;
		} catch (e) {
			if (String(e).includes('UNIQUE')) {
				return fail(409, { error: 'A gear item with that name already exists.' });
			}
			throw e;
		}

		redirect(303, `/admin/gear/${slug}`);
	}
};
