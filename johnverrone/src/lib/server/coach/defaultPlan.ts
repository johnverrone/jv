import type { NewPlanSession } from '$lib/server/db/schema';

/**
 * The default weekly template, per the voice-session decisions: full-body
 * lifting 2×/week (chosen over splits for schedule resilience), two runs, one
 * steady trainer ride, and flexible weekend movement. 10-min pre-lift mobility
 * and core are deliberate weak-point fixes; strength + easy aerobic volume is
 * the A1C/insulin-sensitivity play. Every session has a bare-minimum variant so
 * a chaotic day never has to become a zero. Seeded once via the plan editor's
 * "seed default plan" action; edit freely after that.
 */
export const DEFAULT_PLAN: Omit<NewPlanSession, 'id' | 'createdAt' | 'updatedAt'>[] = [
	{
		dayOfWeek: 1,
		sortOrder: 0,
		name: 'Full body A',
		modality: 'lift',
		durationMin: 45,
		prescription: [
			'Anchor day — non-negotiable.',
			'',
			'- 10-min mobility warmup (hips/ankles)',
			'- Squat — 3×5',
			'- Deadlift — 3×3',
			'- One accessory of choice',
			'- 10-min core'
		].join('\n'),
		bareMin: '3 rounds: goblet squat ×10 · KB deadlift ×10 · plank 45s.',
		bareMinDurationMin: 15
	},
	{
		dayOfWeek: 2,
		sortOrder: 0,
		name: 'Easy run',
		modality: 'run',
		durationMin: 40,
		prescription: [
			'4–5 mi at conversational pace.',
			'Dynamic warmup before; static stretching after.'
		].join('\n'),
		bareMin: '15-min easy jog or brisk walk.',
		bareMinDurationMin: 15
	},
	{
		dayOfWeek: 3,
		sortOrder: 0,
		name: 'Trainer ride',
		modality: 'bike',
		durationMin: 35,
		prescription: '30–40 min steady state on the trainer.',
		bareMin: '15-min easy spin.',
		bareMinDurationMin: 15
	},
	{
		dayOfWeek: 4,
		sortOrder: 0,
		name: 'Full body B',
		modality: 'lift',
		durationMin: 45,
		prescription: [
			'- 10-min mobility warmup (t-spine/shoulders)',
			'- Bench press or overhead press — 3×5',
			'- Deadlift variation — 3×5',
			'- One accessory of choice',
			'- 10-min core'
		].join('\n'),
		bareMin: '3 rounds: pushups ×10 · KB swing ×15 · row ×10.',
		bareMinDurationMin: 15
	},
	{
		dayOfWeek: 5,
		sortOrder: 0,
		name: 'Moderate run',
		modality: 'run',
		durationMin: 45,
		prescription: '5–6 mi with a tempo effort in the middle.',
		bareMin: '20-min easy run, no tempo.',
		bareMinDurationMin: 20
	},
	{
		dayOfWeek: 6,
		sortOrder: 0,
		name: 'Walk or light exercise',
		modality: 'walk',
		durationMin: 30,
		prescription: 'A walk or any easy movement — light and unhurried counts.',
		bareMin: '15-min walk.',
		bareMinDurationMin: 15
	},
	{
		dayOfWeek: 0,
		sortOrder: 0,
		name: 'Rest or hike (flexible)',
		modality: 'rest',
		durationMin: null,
		prescription: 'Optional longer family hike; otherwise full rest plus 10-min mobility.',
		bareMin: '10-min mobility.',
		bareMinDurationMin: 10
	}
];
