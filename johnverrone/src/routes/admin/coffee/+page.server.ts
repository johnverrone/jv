import { error, fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
	listBeans,
	createBean,
	publishBean,
	unpublishBean,
	deleteBean,
	listRoasters,
	createRoaster,
	deleteRoaster
} from '$lib/server/db/coffee';
import { str, centsFromDollars, slugify } from '$lib/server/form';
import type { Actions, PageServerLoad } from './$types';

const csv = (v: FormDataEntryValue | null) =>
	String(v ?? '')
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);
	const [beans, roasters] = await Promise.all([listBeans(db), listRoasters(db)]);
	return { beans, roasters };
};

function requireAuth(authenticated: boolean | undefined) {
	if (!authenticated) error(403, 'Unauthorized');
}

export const actions: Actions = {
	createBean: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const name = str(form.get('name'));
		const roasterSlug = str(form.get('roaster'));
		if (!name || !roasterSlug) return fail(400, { error: 'Name and roaster are required.' });
		const ratingStr = str(form.get('rating'));
		try {
			await createBean(db, {
				slug: slugify(name),
				name,
				roasterSlug,
				rating: ratingStr ? Number(ratingStr) : null,
				origins: csv(form.get('origins')),
				flavors: csv(form.get('flavors')),
				process: str(form.get('process')),
				singleOrigin: form.get('single_origin') === 'on',
				currentlyBrewing: form.get('currently_brewing') === 'on',
				price12ozCents: centsFromDollars(form.get('price_12oz')),
				notes: str(form.get('notes')),
				visibility: 'draft' // new beans start as draft; publish when ready
			});
		} catch (e) {
			if (String(e).includes('UNIQUE')) {
				return fail(409, { error: 'A bean with that name already exists.' });
			}
			throw e;
		}
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
		return { success: true };
	},

	createRoaster: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const name = str(form.get('name'));
		if (!name) return fail(400, { error: 'Roaster name is required.' });
		try {
			await createRoaster(db, {
				slug: slugify(name),
				name,
				location: str(form.get('location')),
				website: str(form.get('website')),
				notes: str(form.get('notes'))
			});
		} catch (e) {
			if (String(e).includes('UNIQUE')) {
				return fail(409, { error: 'A roaster with that name already exists.' });
			}
			throw e;
		}
		return { success: true };
	},

	deleteRoaster: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const id = Number((await request.formData()).get('id'));
		if (id) await deleteRoaster(getDb(platform!.env.DB), id);
		return { success: true };
	}
};
