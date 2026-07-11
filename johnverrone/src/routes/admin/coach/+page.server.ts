import { error, fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
	getTodaySummary,
	getSessionsForDay,
	logWorkout,
	deleteWorkoutLog,
	upsertHabit,
	getHabit
} from '$lib/server/db/coach';
import { MODALITIES, WORKOUT_VARIANTS } from '$lib/server/db/schema';
import { str } from '$lib/server/form';
import { todayCentral, dayOfWeek } from '$lib/server/date';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);
	return { summary: await getTodaySummary(db, todayCentral()) };
};

function requireAuth(authenticated: boolean | undefined) {
	if (!authenticated) error(403, 'Unauthorized');
}

const int = (v: FormDataEntryValue | null) => {
	const n = Number(str(v));
	return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

/** Resolve today's planned session by id, guarding against stale form data. */
async function plannedSession(db: ReturnType<typeof getDb>, id: number) {
	const sessions = await getSessionsForDay(db, dayOfWeek(todayCentral()));
	return sessions.find((s) => s.id === id) ?? null;
}

export const actions: Actions = {
	logDone: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const session = await plannedSession(db, Number(form.get('plan_session_id')));
		if (!session) return fail(400, { error: 'That session is not on today’s plan.' });
		const variant = WORKOUT_VARIANTS.find((v) => v === str(form.get('variant'))) ?? 'full';
		await logWorkout(db, {
			date: todayCentral(),
			planSessionId: session.id,
			status: 'done',
			variant,
			modality: session.modality,
			durationMin:
				int(form.get('duration_min')) ??
				(variant === 'bare_min' ? session.bareMinDurationMin : session.durationMin),
			rpe: int(form.get('rpe')),
			notes: str(form.get('notes'))
		});
		return { success: true };
	},

	logSkipped: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const db = getDb(platform!.env.DB);
		const session = await plannedSession(
			db,
			Number((await request.formData()).get('plan_session_id'))
		);
		if (!session) return fail(400, { error: 'That session is not on today’s plan.' });
		await logWorkout(db, {
			date: todayCentral(),
			planSessionId: session.id,
			status: 'skipped',
			modality: session.modality
		});
		return { success: true };
	},

	logCustom: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const modality = MODALITIES.find((m) => m === str(form.get('modality')));
		if (!modality) return fail(400, { error: 'Pick what you actually did.' });
		const sessions = await getSessionsForDay(db, dayOfWeek(todayCentral()));
		await logWorkout(db, {
			date: todayCentral(),
			planSessionId: sessions[0]?.id ?? null,
			status: 'modified',
			modality,
			durationMin: int(form.get('duration_min')),
			rpe: int(form.get('rpe')),
			notes: str(form.get('notes'))
		});
		return { success: true };
	},

	toggleHabit: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const field = str(form.get('field'));
		if (field !== 'noAddedSugar' && field !== 'noAlcohol' && field !== 'mobilityDone') {
			return fail(400, { error: 'Unknown habit.' });
		}
		const date = todayCentral();
		const current = await getHabit(db, date);
		await upsertHabit(db, date, { [field]: !current?.[field] });
		return { success: true };
	},

	undoWorkout: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const db = getDb(platform!.env.DB);
		const id = Number((await request.formData()).get('id'));
		// Undo is scoped to today's rows so an old log can't be fat-fingered away.
		const todays = await getTodaySummary(db, todayCentral());
		if (id && todays.workouts.some((w) => w.id === id)) await deleteWorkoutLog(db, id);
		return { success: true };
	}
};
