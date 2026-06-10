import { fail, redirect } from '@sveltejs/kit';
import { hobbiesWrite } from '$lib/server/hobbiesWrite';
import { centsFromDollars, str } from '$lib/server/form';
import type { GearItem } from '$lib/gear/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data = await hobbiesWrite<{ items: GearItem[] }>('/gear', { method: 'GET' });
	return { items: data?.items ?? [] };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const name = str(form.get('name'));
		const category = str(form.get('category'));
		if (!name || !category) {
			return fail(400, { error: 'Name and category are required.' });
		}

		const body = {
			name,
			category,
			manufacturer: str(form.get('manufacturer')),
			model: str(form.get('model')),
			serial_number: str(form.get('serial_number')),
			acquired_date: str(form.get('acquired_date')),
			acquired_price_cents: centsFromDollars(form.get('acquired_price')),
			notes: str(form.get('notes')),
			image_url: str(form.get('image_url'))
		};

		let slug: string;
		try {
			const res = await hobbiesWrite<{ item: GearItem }>('/gear', { method: 'POST', body });
			slug = res!.item.slug;
		} catch (e) {
			const message = e instanceof Error ? e.message : String(e);
			if (message.includes('409')) {
				return fail(409, { error: 'A gear item with that name already exists.' });
			}
			return fail(500, { error: 'Failed to save gear.' });
		}

		redirect(303, `/gear/${slug}`);
	}
};
