import { error, fail, redirect } from '@sveltejs/kit';
import { hobbiesWrite } from '$lib/server/hobbiesWrite';
import { centsFromDollars, str } from '$lib/server/form';
import type { GearItem, MaintenanceLog } from '$lib/gear/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const data = await hobbiesWrite<{ item: GearItem; maintenance: MaintenanceLog[] }>(
		`/gear/${params.slug}`,
		{ method: 'GET' }
	);
	if (!data?.item) error(404, 'Gear not found');
	return { item: data.item, maintenance: data.maintenance ?? [] };
};

export const actions: Actions = {
	updateStatus: async ({ request }) => {
		const form = await request.formData();
		const id = Number(form.get('id'));
		const status = str(form.get('status'));
		if (!id || !status) return fail(400, { error: 'Invalid status update.' });
		await hobbiesWrite(`/gear/${id}`, { method: 'PUT', body: { status } });
		return { success: true };
	},

	addMaintenance: async ({ request }) => {
		const form = await request.formData();
		const id = Number(form.get('id'));
		const performed_date = str(form.get('performed_date'));
		const type = str(form.get('type'));
		if (!id || !performed_date || !type) {
			return fail(400, { error: 'Date and type are required.' });
		}
		await hobbiesWrite(`/gear/${id}/maintenance`, {
			method: 'POST',
			body: {
				performed_date,
				type,
				description: str(form.get('description')),
				cost_cents: centsFromDollars(form.get('cost')),
				performed_by: str(form.get('performed_by'))
			}
		});
		return { success: true };
	},

	deleteMaintenance: async ({ request }) => {
		const form = await request.formData();
		const logId = Number(form.get('log_id'));
		if (!logId) return fail(400, { error: 'Invalid maintenance entry.' });
		await hobbiesWrite(`/maintenance/${logId}`, { method: 'DELETE' });
		return { success: true };
	},

	deleteGear: async ({ request }) => {
		const form = await request.formData();
		const id = Number(form.get('id'));
		if (!id) return fail(400, { error: 'Invalid gear item.' });
		await hobbiesWrite(`/gear/${id}`, { method: 'DELETE' });
		redirect(303, '/gear');
	}
};
