import { env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { getDb } from '$lib/server/db';
import { logWorkout, getWorkoutsForDate } from '$lib/server/db/coach';
import { POST } from './+server';
import { GET } from '../../exercise/+server';

const TOKEN = 'test-token';
const platform = { env: { DB: env.DB, COACH_API_TOKEN: TOKEN } };
const auth = { Authorization: `Bearer ${TOKEN}` };

async function post(body: unknown) {
	const request = new Request('http://test/api/coach/log/workout', {
		method: 'POST',
		headers: { ...auth, 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const res = await POST({ request, platform } as any);
	return { status: res.status, body: (await res.json()) as Record<string, any> }; // eslint-disable-line @typescript-eslint/no-explicit-any
}

async function history(query: string) {
	const url = new URL(`http://test/api/coach/exercise?${query}`);
	const request = new Request(url, { headers: auth });
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const res = await GET({ request, platform, url } as any);
	return { status: res.status, body: (await res.json()) as Record<string, any> }; // eslint-disable-line @typescript-eslint/no-explicit-any
}

describe('POST /api/coach/log/workout', () => {
	it('creates a log with exercises, then patches only the fields sent', async () => {
		const created = await post({
			date: '2026-10-05',
			status: 'done',
			modality: 'lift',
			duration_min: 50,
			plan_session_id: null,
			exercises: [{ name: 'Back Squat', sets: 3, reps: 5, weight_lb: 185, rpe: 8 }]
		});
		expect(created.status).toBe(201);
		expect(created.body.exercises).toHaveLength(1);

		// Patch: append an exercise and set rpe — duration must survive untouched.
		const patched = await post({
			id: created.body.id,
			rpe: 7,
			exercises: [{ name: 'Bench Press', sets: 3, reps: 8, weight_lb: 135 }],
			exercises_mode: 'append'
		});
		expect(patched.status).toBe(200);
		expect(patched.body.durationMin).toBe(50);
		expect(patched.body.rpe).toBe(7);
		expect(patched.body.exercises.map((e: { name: string }) => e.name)).toEqual([
			'Back Squat',
			'Bench Press'
		]);

		// null clears explicitly.
		const cleared = await post({ id: created.body.id, rpe: null });
		expect(cleared.body.rpe).toBeNull();
		expect(cleared.body.durationMin).toBe(50);
	});

	it('patches the date of an existing log', async () => {
		const db = getDb(env.DB);
		const log = await logWorkout(db, { date: '2026-10-06', status: 'done', modality: 'lift' });
		const res = await post({ id: log.id, date: '2026-10-07' });
		expect(res.status).toBe(200);
		expect(res.body.date).toBe('2026-10-07');
	});

	it('rejects bad types instead of silently clearing stored values', async () => {
		const db = getDb(env.DB);
		const log = await logWorkout(db, {
			date: '2026-10-08',
			status: 'done',
			modality: 'lift',
			durationMin: 45
		});

		for (const bad of [
			{ duration_min: '45' },
			{ plan_session_id: '3' },
			{ rpe: 42 },
			{ rpe: 7.5 },
			{ date: 'yesterday' },
			{ status: 'crushed' },
			{ exercises_mode: 'merge' }
		]) {
			const res = await post({ id: log.id, ...bad });
			expect(res.status, JSON.stringify(bad)).toBe(400);
		}
		const [after] = await getWorkoutsForDate(db, '2026-10-08');
		expect(after.durationMin).toBe(45); // untouched by any of the rejected patches
	});

	it('rejects malformed exercises, naming the bad entry', async () => {
		const db = getDb(env.DB);
		const log = await logWorkout(db, { date: '2026-10-09', status: 'done', modality: 'lift' });

		for (const [exercise, field] of [
			[{ name: '---' }, 'exercises[0].name'],
			[{ name: 'Squat', sets: 0 }, 'exercises[0].sets'],
			[{ name: 'Squat', reps: -3 }, 'exercises[0].reps'],
			[{ name: 'Squat', reps: 8.5 }, 'exercises[0].reps'],
			[{ name: 'Squat', weight_lb: -100 }, 'exercises[0].weight_lb'],
			[{ name: 'Squat', rpe: 7.5 }, 'exercises[0].rpe']
		] as const) {
			const res = await post({ id: log.id, exercises: [exercise] });
			expect(res.status, JSON.stringify(exercise)).toBe(400);
			expect(res.body.error).toContain(field);
		}
		const [after] = await getWorkoutsForDate(db, '2026-10-09');
		expect(after.exercises).toEqual([]);
	});

	it('404s an unknown id and requires status + modality to create', async () => {
		expect((await post({ id: 999_999, rpe: 5 })).status).toBe(404);
		expect((await post({ modality: 'lift' })).status).toBe(400);
		expect((await post({ status: 'done' })).status).toBe(400);
	});
});

describe('GET /api/coach/exercise', () => {
	it('caps limit and rejects names with no letters or digits', async () => {
		for (const date of ['2026-10-01', '2026-10-02', '2026-10-03']) {
			await post({
				date,
				status: 'done',
				modality: 'lift',
				exercises: [{ name: 'Overhead Press', sets: 3, reps: 5, weight_lb: 95 }]
			});
		}

		// A negative limit falls back to the default rather than slicing from the end.
		const negative = await history('name=overhead%20press&limit=-1');
		expect(negative.status).toBe(200);
		expect(negative.body.entries).toHaveLength(3);
		expect((await history('name=overhead-press&limit=2')).body.entries).toHaveLength(2);

		expect((await history('name=---')).status).toBe(400);
		expect((await history('')).status).toBe(400);
	});
});
