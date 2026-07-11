import { env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { getDb } from './index';
import {
	listJournalEntries,
	getJournalEntry,
	createJournalEntry,
	updateJournalEntry,
	deleteJournalEntry,
	listSongs,
	createSong,
	updateSong,
	deleteSong,
	getPlan,
	setPlan
} from './guitar';

describe('guitar data layer (real Miniflare D1)', () => {
	it('migrated the real historical content', async () => {
		const db = getDb(env.DB);

		const entries = await listJournalEntries(db);
		expect(entries).toHaveLength(19);
		expect(entries[0].date).toBe('2026-04-01'); // newest first
		expect(entries[entries.length - 1].date).toBe('2026-02-15');

		const songs = await listSongs(db);
		expect(songs).toHaveLength(30);
		expect(songs[0].title).toBe('Wonderwall'); // sort_order 0

		const plan = await getPlan(db);
		expect(plan).toContain('# Practice Plan');
		expect(plan).toContain('Next Level Playing');
	});

	it('runs the journal entry lifecycle', async () => {
		const db = getDb(env.DB);

		const created = await createJournalEntry(db, {
			date: '2026-05-01',
			durationMin: 45,
			theme: 'Test session',
			content: 'test content'
		});
		expect(created.id).toBeGreaterThan(0);

		expect((await getJournalEntry(db, '2026-05-01'))?.theme).toBe('Test session');
		expect(await getJournalEntry(db, '2099-01-01')).toBeNull();

		await updateJournalEntry(db, created.id, { durationMin: 60 });
		expect((await getJournalEntry(db, '2026-05-01'))?.durationMin).toBe(60);

		await deleteJournalEntry(db, created.id);
		expect(await getJournalEntry(db, '2026-05-01')).toBeNull();
	});

	it('runs the song lifecycle, ordered by sort_order then title', async () => {
		const db = getDb(env.DB);

		const created = await createSong(db, {
			sortOrder: 999,
			title: 'Test Song',
			artist: 'Test Artist',
			difficulty: 'Beginner',
			genre: 'Rock',
			key: 'C',
			tuning: 'Standard (EADGBE)',
			bpm: 100,
			progress: 'Not Started'
		});
		expect(created.id).toBeGreaterThan(0);

		const songs = await listSongs(db);
		expect(songs[songs.length - 1].title).toBe('Test Song'); // highest sort_order, last

		await updateSong(db, created.id, { progress: 'Learning' });
		const updated = (await listSongs(db)).find((s) => s.id === created.id);
		expect(updated?.progress).toBe('Learning');

		await deleteSong(db, created.id);
		expect((await listSongs(db)).find((s) => s.id === created.id)).toBeUndefined();
	});

	it('upserts the singleton plan', async () => {
		const db = getDb(env.DB);

		await setPlan(db, 'first version');
		expect(await getPlan(db)).toBe('first version');

		// Second call updates the same row (id=1), doesn't create a second one.
		await setPlan(db, 'second version');
		expect(await getPlan(db)).toBe('second version');
	});
});
