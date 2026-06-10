import { error, fail, redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
	getGearBySlug,
	updateGear,
	deleteGear,
	publishGear,
	unpublishGear,
	addMaintenance,
	deleteMaintenance
} from '$lib/server/db/gear';
import { centsFromDollars, str } from '$lib/server/form';
import type { GearStatus } from '$lib/gear/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = getDb(platform!.env.DB);
	const data = await getGearBySlug(db, params.slug);
	if (!data) error(404, 'Gear not found');
	return data;
};

export const actions: Actions = {
	updateStatus: async ({ request, platform }) => {
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const id = Number(form.get('id'));
		const status = str(form.get('status'));
		if (!id || !status) return fail(400, { error: 'Invalid status update.' });
		await updateGear(db, id, { status: status as GearStatus });
		return { success: true };
	},

	publish: async ({ request, platform }) => {
		const db = getDb(platform!.env.DB);
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400, { error: 'Invalid gear item.' });
		await publishGear(db, id);
		return { success: true };
	},

	unpublish: async ({ request, platform }) => {
		const db = getDb(platform!.env.DB);
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400, { error: 'Invalid gear item.' });
		await unpublishGear(db, id);
		return { success: true };
	},

	addMaintenance: async ({ request, platform }) => {
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const id = Number(form.get('id'));
		const performedDate = str(form.get('performed_date'));
		const type = str(form.get('type'));
		if (!id || !performedDate || !type) {
			return fail(400, { error: 'Date and type are required.' });
		}
		await addMaintenance(db, id, {
			performedDate,
			type,
			description: str(form.get('description')),
			costCents: centsFromDollars(form.get('cost')),
			performedBy: str(form.get('performed_by'))
		});
		return { success: true };
	},

	deleteMaintenance: async ({ request, platform }) => {
		const db = getDb(platform!.env.DB);
		const logId = Number((await request.formData()).get('log_id'));
		if (!logId) return fail(400, { error: 'Invalid maintenance entry.' });
		await deleteMaintenance(db, logId);
		return { success: true };
	},

	deleteGear: async ({ request, platform }) => {
		const db = getDb(platform!.env.DB);
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400, { error: 'Invalid gear item.' });
		await deleteGear(db, id);
		redirect(303, '/admin/gear');
	}
};
