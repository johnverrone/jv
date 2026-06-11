import type { D1Database } from '@cloudflare/workers-types';
import type { D1Migration } from '@cloudflare/vitest-pool-workers';

declare module 'cloudflare:test' {
	interface ProvidedEnv {
		DB: D1Database;
		TEST_MIGRATIONS: D1Migration[];
	}
}
