import { error, fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
	getTodaySummary,
	getSessionsForDay,
	getWeekAdherence,
	logWorkout,
	deleteWorkoutLog,
	upsertHabit,
	getHabit,
	listPlanSessions,
	createPlanSession,
	updatePlanSession,
	deletePlanSession,
	seedDefaultPlan
} from '$lib/server/db/coach';
import { MODALITIES, WORKOUT_VARIANTS } from '$lib/server/db/schema';
import { str } from '$lib/server/form';
import { addDays, todayCentral, dayOfWeek, weekStart } from '$lib/server/date';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, url }) => {
	const db = getDb(platform!.env.DB);
	const today = todayCentral();
	// Normalize any requested date onto its Monday so prev/next links stay
	// aligned; malformed dates fall back to the current week.
	const requested = url.searchParams.get('start');
	const start = weekStart(requested && /^\d{4}-\d{2}-\d{2}$/.test(requested) ? requested : today);
	const currentWeek = start === weekStart(today);
	const [summary, planSessions, pagedWeek] = await Promise.all([
		getTodaySummary(db, today),
		listPlanSessions(db),
		currentWeek ? null : getWeekAdherence(db, start)
	]);
	return {
		summary,
		planSessions,
		week: pagedWeek ?? summary.weekAdherence,
		currentWeek,
		prevStart: addDays(start, -7),
		nextStart: addDays(start, 7)
	};
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

function sessionInput(form: FormData) {
	const name = str(form.get('name'));
	const modality = MODALITIES.find((m) => m === str(form.get('modality')));
	const dayOfWeek = Number(str(form.get('day_of_week')));
	if (!name || !modality || !(dayOfWeek >= 0 && dayOfWeek <= 6)) return null;
	return {
		name,
		modality,
		dayOfWeek,
		sortOrder: int(form.get('sort_order')) ?? 0,
		durationMin: int(form.get('duration_min')),
		prescription: str(form.get('prescription')),
		bareMin: str(form.get('bare_min')),
		bareMinDurationMin: int(form.get('bare_min_duration_min')),
		active: form.get('active') === 'on'
	};
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
	},

	seed: async ({ locals, platform }) => {
		requireAuth(locals.authenticated);
		await seedDefaultPlan(getDb(platform!.env.DB));
		return { success: true };
	},

	create: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const input = sessionInput(await request.formData());
		if (!input) return fail(400, { error: 'Name, modality, and day are required.' });
		await createPlanSession(getDb(platform!.env.DB), input);
		return { success: true };
	},

	update: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const form = await request.formData();
		const id = Number(form.get('id'));
		const input = sessionInput(form);
		if (!id || !input) return fail(400, { error: 'Name, modality, and day are required.' });
		await updatePlanSession(getDb(platform!.env.DB), id, input);
		return { success: true };
	},

	delete: async ({ request, locals, platform }) => {
		requireAuth(locals.authenticated);
		const id = Number((await request.formData()).get('id'));
		if (id) await deletePlanSession(getDb(platform!.env.DB), id);
		return { success: true };
	}
};
