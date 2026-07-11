import { eq, and, desc, sql } from 'drizzle-orm';
import type { DB } from './index';
import {
	gearItem,
	maintenanceLog,
	type GearItem,
	type NewGearItem,
	type NewMaintenanceLog
} from './schema';

const now = sql`(datetime('now'))`;

/** List gear. `publishedOnly` is the filter the public site uses; admin omits it. */
export async function listGear(
	db: DB,
	opts: { publishedOnly?: boolean; status?: GearItem['status'] } = {}
) {
	const filters = [];
	if (opts.publishedOnly) filters.push(eq(gearItem.visibility, 'published'));
	if (opts.status) filters.push(eq(gearItem.status, opts.status));

	return db
		.select()
		.from(gearItem)
		.where(filters.length ? and(...filters) : undefined)
		.orderBy(gearItem.name);
}

/** A single item with its maintenance history. Returns null if not found. */
export async function getGearBySlug(db: DB, slug: string) {
	const [item] = await db.select().from(gearItem).where(eq(gearItem.slug, slug)).limit(1);
	if (!item) return null;
	const maintenance = await db
		.select()
		.from(maintenanceLog)
		.where(eq(maintenanceLog.gearItemId, item.id))
		.orderBy(desc(maintenanceLog.performedDate), desc(maintenanceLog.id));
	return { item, maintenance };
}

/** Create a gear item. New items are `draft` by default (curation is deliberate). */
export async function createGear(
	db: DB,
	input: Omit<NewGearItem, 'id' | 'createdAt' | 'updatedAt'>
) {
	const [item] = await db.insert(gearItem).values(input).returning();
	return item;
}

/** Partial update — only provided fields change. */
export async function updateGear(db: DB, id: number, patch: Partial<NewGearItem>) {
	const [item] = await db
		.update(gearItem)
		.set({ ...patch, updatedAt: now })
		.where(eq(gearItem.id, id))
		.returning();
	return item ?? null;
}

/** Promote to the public spotlight; stamps `published_at` on first publish. */
export async function publishGear(db: DB, id: number) {
	const [item] = await db
		.update(gearItem)
		.set({ visibility: 'published', publishedAt: now, updatedAt: now })
		.where(eq(gearItem.id, id))
		.returning();
	return item ?? null;
}

/** Pull back to draft (hide from the public site). Keeps `published_at` for history. */
export async function unpublishGear(db: DB, id: number) {
	const [item] = await db
		.update(gearItem)
		.set({ visibility: 'draft', updatedAt: now })
		.where(eq(gearItem.id, id))
		.returning();
	return item ?? null;
}

/** Delete a gear item; maintenance rows cascade via the foreign key. */
export async function deleteGear(db: DB, id: number) {
	await db.delete(gearItem).where(eq(gearItem.id, id));
}

export async function addMaintenance(
	db: DB,
	gearItemId: number,
	input: Omit<NewMaintenanceLog, 'id' | 'gearItemId' | 'createdAt'>
) {
	const [entry] = await db
		.insert(maintenanceLog)
		.values({ ...input, gearItemId })
		.returning();
	return entry;
}

export async function deleteMaintenance(db: DB, id: number) {
	await db.delete(maintenanceLog).where(eq(maintenanceLog.id, id));
}
