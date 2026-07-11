import { sqliteTable, integer, real, text, index, unique } from 'drizzle-orm/sqlite-core';
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

// --- Health coach (see migrations/0004_coach.sql) ---
// All `date` columns are local America/Chicago days as ISO yyyy-mm-dd text,
// computed server-side (src/lib/server/date.ts). dayOfWeek matches Date#getDay.

export {
	MODALITIES,
	WORKOUT_STATUSES,
	WORKOUT_VARIANTS,
	CHECK_IN_TYPES,
	type Modality
} from '../../coach/types';
import { MODALITIES, WORKOUT_STATUSES, WORKOUT_VARIANTS, CHECK_IN_TYPES } from '../../coach/types';

export const planSession = sqliteTable(
	'plan_session',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		dayOfWeek: integer('day_of_week').notNull(), // 0=Sunday..6=Saturday
		sortOrder: integer('sort_order').notNull().default(0),
		name: text('name').notNull(),
		modality: text('modality', { enum: MODALITIES }).notNull(),
		durationMin: integer('duration_min'),
		prescription: text('prescription'), // markdown: the full session
		bareMin: text('bare_min'), // markdown: 10-15 min fallback for chaotic days
		bareMinDurationMin: integer('bare_min_duration_min'),
		active: integer('active', { mode: 'boolean' }).notNull().default(true),
		createdAt: text('created_at')
			.notNull()
			.default(sql`(datetime('now'))`),
		updatedAt: text('updated_at')
			.notNull()
			.default(sql`(datetime('now'))`)
	},
	(t) => [index('idx_plan_dow').on(t.dayOfWeek, t.sortOrder)]
);

export const workoutLog = sqliteTable(
	'workout_log',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		date: text('date').notNull(),
		planSessionId: integer('plan_session_id').references(() => planSession.id, {
			onDelete: 'set null'
		}),
		status: text('status', { enum: WORKOUT_STATUSES }).notNull(),
		variant: text('variant', { enum: WORKOUT_VARIANTS }).notNull().default('full'),
		modality: text('modality', { enum: MODALITIES }).notNull(),
		durationMin: integer('duration_min'),
		rpe: integer('rpe'), // 1-10
		notes: text('notes'),
		source: text('source', { enum: ['manual', 'api', 'strava', 'whoop'] })
			.notNull()
			.default('manual'),
		stravaActivityId: text('strava_activity_id').unique(), // sync dedupe key
		whoopWorkoutId: text('whoop_workout_id').unique(), // sync dedupe key (v2 UUID)
		createdAt: text('created_at')
			.notNull()
			.default(sql`(datetime('now'))`)
	},
	(t) => [index('idx_workout_date').on(t.date)]
);

export const habitLog = sqliteTable('habit_log', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	date: text('date').notNull().unique(), // one row per day; upsert target
	noAddedSugar: integer('no_added_sugar', { mode: 'boolean' }).notNull().default(false),
	noAlcohol: integer('no_alcohol', { mode: 'boolean' }).notNull().default(false),
	mobilityDone: integer('mobility_done', { mode: 'boolean' }).notNull().default(false),
	notes: text('notes'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(datetime('now'))`)
});

export const bodyMetric = sqliteTable(
	'body_metric',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		date: text('date').notNull(),
		type: text('type').notNull(), // weight_lb|a1c|resting_hr|... (open set)
		value: real('value').notNull(),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.default(sql`(datetime('now'))`)
	},
	(t) => [
		unique('uq_metric_date_type').on(t.date, t.type),
		index('idx_metric_type_date').on(t.type, t.date)
	]
);

export const checkIn = sqliteTable(
	'check_in',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		date: text('date').notNull(),
		type: text('type', { enum: CHECK_IN_TYPES }).notNull(),
		author: text('author', { enum: ['coach', 'john'] })
			.notNull()
			.default('coach'),
		content: text('content').notNull(), // markdown
		createdAt: text('created_at')
			.notNull()
			.default(sql`(datetime('now'))`)
	},
	(t) => [index('idx_checkin_date').on(t.date, t.type)]
);

// One row per provider (see migrations/0005_integrations.sql). Refresh tokens
// rotate on both providers — always persist the pair returned by a refresh.
export const oauthToken = sqliteTable('oauth_token', {
	provider: text('provider', { enum: ['strava', 'whoop'] }).primaryKey(),
	accessToken: text('access_token').notNull(),
	refreshToken: text('refresh_token').notNull(),
	expiresAt: integer('expires_at').notNull(), // unix seconds
	athleteId: text('athlete_id'),
	scopes: text('scopes'),
	lastSyncedAt: text('last_synced_at'),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(datetime('now'))`)
});

export type OAuthToken = typeof oauthToken.$inferSelect;
export type NewOAuthToken = typeof oauthToken.$inferInsert;

export type PlanSession = typeof planSession.$inferSelect;
export type NewPlanSession = typeof planSession.$inferInsert;
export type WorkoutLog = typeof workoutLog.$inferSelect;
export type NewWorkoutLog = typeof workoutLog.$inferInsert;
export type HabitLog = typeof habitLog.$inferSelect;
export type NewHabitLog = typeof habitLog.$inferInsert;
export type BodyMetric = typeof bodyMetric.$inferSelect;
export type NewBodyMetric = typeof bodyMetric.$inferInsert;
export type CheckIn = typeof checkIn.$inferSelect;
export type NewCheckIn = typeof checkIn.$inferInsert;

// --- Guitar (see migrations/0007_guitar.sql) ---
// Migrated off the legacy `hobbies` Worker's flat YAML/Markdown files.

export const guitarJournalEntry = sqliteTable(
	'guitar_journal_entry',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		date: text('date').notNull().unique(), // yyyy-mm-dd
		durationMin: integer('duration_min').notNull(),
		theme: text('theme').notNull(),
		content: text('content').notNull(), // markdown
		createdAt: text('created_at')
			.notNull()
			.default(sql`(datetime('now'))`),
		updatedAt: text('updated_at')
			.notNull()
			.default(sql`(datetime('now'))`)
	},
	(t) => [index('idx_guitar_journal_date').on(t.date)]
);

export const guitarSong = sqliteTable(
	'guitar_song',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		sortOrder: integer('sort_order').notNull().default(0),
		title: text('title').notNull(),
		artist: text('artist').notNull(),
		difficulty: text('difficulty', { enum: ['Beginner', 'Intermediate', 'Advanced'] }).notNull(),
		genre: text('genre').notNull(),
		key: text('key').notNull(),
		tuning: text('tuning').notNull(),
		bpm: integer('bpm').notNull(),
		capo: integer('capo'),
		progress: text('progress').notNull().default('Not Started'),
		tabLink: text('tab_link'),
		notes: text('notes'),
		createdAt: text('created_at')
			.notNull()
			.default(sql`(datetime('now'))`),
		updatedAt: text('updated_at')
			.notNull()
			.default(sql`(datetime('now'))`)
	},
	(t) => [index('idx_guitar_song_sort').on(t.sortOrder)]
);

// Singleton: always exactly one row (id=1). See getPlan/setPlan in guitar.ts.
export const guitarPlan = sqliteTable('guitar_plan', {
	id: integer('id').primaryKey(),
	content: text('content').notNull(),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(datetime('now'))`)
});

export type GuitarJournalEntry = typeof guitarJournalEntry.$inferSelect;
export type NewGuitarJournalEntry = typeof guitarJournalEntry.$inferInsert;
export type GuitarSong = typeof guitarSong.$inferSelect;
export type NewGuitarSong = typeof guitarSong.$inferInsert;
export type GuitarPlan = typeof guitarPlan.$inferSelect;
