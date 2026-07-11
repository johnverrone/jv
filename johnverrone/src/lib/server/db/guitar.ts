import { eq, desc, asc, sql } from 'drizzle-orm';
import type { DB } from './index';
import {
	guitarJournalEntry,
	guitarSong,
	guitarPlan,
	type NewGuitarJournalEntry,
	type NewGuitarSong
} from './schema';

const now = sql`(datetime('now'))`;

// --- Journal ---

export async function listJournalEntries(db: DB) {
	return db.select().from(guitarJournalEntry).orderBy(desc(guitarJournalEntry.date));
}

export async function getJournalEntry(db: DB, date: string) {
	const [entry] = await db
		.select()
		.from(guitarJournalEntry)
		.where(eq(guitarJournalEntry.date, date))
		.limit(1);
	return entry ?? null;
}

export async function createJournalEntry(
	db: DB,
	input: Omit<NewGuitarJournalEntry, 'id' | 'createdAt' | 'updatedAt'>
) {
	const [entry] = await db.insert(guitarJournalEntry).values(input).returning();
	return entry;
}

export async function updateJournalEntry(
	db: DB,
	id: number,
	patch: Partial<NewGuitarJournalEntry>
) {
	const [entry] = await db
		.update(guitarJournalEntry)
		.set({ ...patch, updatedAt: now })
		.where(eq(guitarJournalEntry.id, id))
		.returning();
	return entry ?? null;
}

export async function deleteJournalEntry(db: DB, id: number) {
	await db.delete(guitarJournalEntry).where(eq(guitarJournalEntry.id, id));
}

// --- Songs ---

export async function listSongs(db: DB) {
	return db.select().from(guitarSong).orderBy(asc(guitarSong.sortOrder), asc(guitarSong.title));
}

export async function createSong(
	db: DB,
	input: Omit<NewGuitarSong, 'id' | 'createdAt' | 'updatedAt'>
) {
	const [song] = await db.insert(guitarSong).values(input).returning();
	return song;
}

export async function updateSong(db: DB, id: number, patch: Partial<NewGuitarSong>) {
	const [song] = await db
		.update(guitarSong)
		.set({ ...patch, updatedAt: now })
		.where(eq(guitarSong.id, id))
		.returning();
	return song ?? null;
}

export async function deleteSong(db: DB, id: number) {
	await db.delete(guitarSong).where(eq(guitarSong.id, id));
}

// --- Plan (singleton row, id=1) ---

export async function getPlan(db: DB) {
	const [plan] = await db.select().from(guitarPlan).where(eq(guitarPlan.id, 1)).limit(1);
	return plan?.content ?? null;
}

export async function setPlan(db: DB, content: string) {
	const [plan] = await db
		.insert(guitarPlan)
		.values({ id: 1, content })
		.onConflictDoUpdate({ target: guitarPlan.id, set: { content, updatedAt: now } })
		.returning();
	return plan;
}
