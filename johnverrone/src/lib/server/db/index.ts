import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from './schema';

/**
 * Wrap a D1 binding (`event.platform.env.DB` once the app runs on Cloudflare) in a
 * typed Drizzle client. This is the single data-access entrypoint shared by public
 * loads, admin actions, and — later — the MCP server. Lives under `$lib/server` so
 * it can never bundle into client code.
 */
export function getDb(d1: D1Database) {
	return drizzle(d1, { schema });
}

export type DB = ReturnType<typeof getDb>;
export * from './schema';
