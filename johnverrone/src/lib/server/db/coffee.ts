import { eq, asc, sql } from 'drizzle-orm';
import type { DB } from './index';
import { coffeeBean, coffeeRoaster, type NewCoffeeBean, type NewCoffeeRoaster } from './schema';

const now = sql`(datetime('now'))`;

// --- Roasters ---------------------------------------------------------------

export async function listRoasters(db: DB) {
	return db.select().from(coffeeRoaster).orderBy(asc(coffeeRoaster.name));
}

export async function getRoasterBySlug(db: DB, slug: string) {
	const [r] = await db.select().from(coffeeRoaster).where(eq(coffeeRoaster.slug, slug)).limit(1);
	return r ?? null;
}

export async function createRoaster(
	db: DB,
	input: Omit<NewCoffeeRoaster, 'id' | 'createdAt' | 'updatedAt'>
) {
	const [r] = await db.insert(coffeeRoaster).values(input).returning();
	return r;
}

export async function updateRoaster(db: DB, id: number, patch: Partial<NewCoffeeRoaster>) {
	const [r] = await db
		.update(coffeeRoaster)
		.set({ ...patch, updatedAt: now })
		.where(eq(coffeeRoaster.id, id))
		.returning();
	return r ?? null;
}

export async function deleteRoaster(db: DB, id: number) {
	await db.delete(coffeeRoaster).where(eq(coffeeRoaster.id, id));
}

// --- Beans ------------------------------------------------------------------

/** List beans. `publishedOnly` is the public filter; admin omits it. */
export async function listBeans(db: DB, opts: { publishedOnly?: boolean } = {}) {
	return db
		.select()
		.from(coffeeBean)
		.where(opts.publishedOnly ? eq(coffeeBean.visibility, 'published') : undefined)
		.orderBy(asc(coffeeBean.name));
}

export async function getBeanBySlug(db: DB, slug: string) {
	const [b] = await db.select().from(coffeeBean).where(eq(coffeeBean.slug, slug)).limit(1);
	return b ?? null;
}

export async function createBean(
	db: DB,
	input: Omit<NewCoffeeBean, 'id' | 'createdAt' | 'updatedAt'>
) {
	const [b] = await db.insert(coffeeBean).values(input).returning();
	return b;
}

export async function updateBean(db: DB, id: number, patch: Partial<NewCoffeeBean>) {
	const [b] = await db
		.update(coffeeBean)
		.set({ ...patch, updatedAt: now })
		.where(eq(coffeeBean.id, id))
		.returning();
	return b ?? null;
}

export async function publishBean(db: DB, id: number) {
	const [b] = await db
		.update(coffeeBean)
		.set({ visibility: 'published', updatedAt: now })
		.where(eq(coffeeBean.id, id))
		.returning();
	return b ?? null;
}

export async function unpublishBean(db: DB, id: number) {
	const [b] = await db
		.update(coffeeBean)
		.set({ visibility: 'draft', updatedAt: now })
		.where(eq(coffeeBean.id, id))
		.returning();
	return b ?? null;
}

export async function deleteBean(db: DB, id: number) {
	await db.delete(coffeeBean).where(eq(coffeeBean.id, id));
}
