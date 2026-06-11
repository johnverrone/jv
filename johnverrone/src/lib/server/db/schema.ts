import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const gearItem = sqliteTable('gear_item', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull().unique(),
	name: text('name').notNull(),
	category: text('category').notNull(),
	manufacturer: text('manufacturer'),
	model: text('model'),
	serialNumber: text('serial_number'),
	acquiredDate: text('acquired_date'), // ISO yyyy-mm-dd
	acquiredPriceCents: integer('acquired_price_cents'),
	// Physical lifecycle of the item.
	status: text('status', { enum: ['active', 'stored', 'sold', 'retired'] })
		.notNull()
		.default('active'),
	notes: text('notes'),
	imageUrl: text('image_url'),
	// Publish gate — orthogonal to `status`. See migrations/0002_publish.sql.
	visibility: text('visibility', { enum: ['draft', 'published'] })
		.notNull()
		.default('draft'),
	publishedAt: text('published_at'),
	featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(datetime('now'))`)
});

export const maintenanceLog = sqliteTable(
	'maintenance_log',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		gearItemId: integer('gear_item_id')
			.notNull()
			.references(() => gearItem.id, { onDelete: 'cascade' }),
		performedDate: text('performed_date').notNull(),
		type: text('type').notNull(),
		description: text('description'),
		costCents: integer('cost_cents'),
		performedBy: text('performed_by'),
		createdAt: text('created_at')
			.notNull()
			.default(sql`(datetime('now'))`)
	},
	(t) => [index('idx_maint_gear').on(t.gearItemId, t.performedDate)]
);

export type GearItem = typeof gearItem.$inferSelect;
export type NewGearItem = typeof gearItem.$inferInsert;
export type MaintenanceLog = typeof maintenanceLog.$inferSelect;
export type NewMaintenanceLog = typeof maintenanceLog.$inferInsert;

export const coffeeRoaster = sqliteTable('coffee_roaster', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull().unique(),
	name: text('name').notNull(),
	location: text('location'),
	website: text('website'),
	notes: text('notes'),
	imageKey: text('image_key'), // R2 key in the coffee bucket
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(datetime('now'))`)
});

export const coffeeBean = sqliteTable(
	'coffee_bean',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		slug: text('slug').notNull().unique(),
		name: text('name').notNull(),
		roasterSlug: text('roaster_slug')
			.notNull()
			.references(() => coffeeRoaster.slug),
		rating: integer('rating'), // 1-5
		origins: text('origins', { mode: 'json' })
			.$type<string[]>()
			.notNull()
			.default(sql`'[]'`),
		flavors: text('flavors', { mode: 'json' })
			.$type<string[]>()
			.notNull()
			.default(sql`'[]'`),
		process: text('process'),
		singleOrigin: integer('single_origin', { mode: 'boolean' }).notNull().default(false),
		currentlyBrewing: integer('currently_brewing', { mode: 'boolean' }).notNull().default(false),
		price12ozCents: integer('price_12oz_cents'),
		notes: text('notes'),
		imageKey: text('image_key'), // R2 key in the coffee bucket
		visibility: text('visibility', { enum: ['draft', 'published'] })
			.notNull()
			.default('published'),
		createdAt: text('created_at')
			.notNull()
			.default(sql`(datetime('now'))`),
		updatedAt: text('updated_at')
			.notNull()
			.default(sql`(datetime('now'))`)
	},
	(t) => [
		index('idx_bean_roaster').on(t.roasterSlug),
		index('idx_bean_visibility').on(t.visibility)
	]
);

export type CoffeeRoaster = typeof coffeeRoaster.$inferSelect;
export type NewCoffeeRoaster = typeof coffeeRoaster.$inferInsert;
export type CoffeeBean = typeof coffeeBean.$inferSelect;
export type NewCoffeeBean = typeof coffeeBean.$inferInsert;
