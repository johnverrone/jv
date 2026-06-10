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
