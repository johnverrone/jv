import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-pool-workers';

// Runs tests inside a real workerd + Miniflare D1 (local SQLite), applying the
// actual migrations/ files — so the data layer is exercised over the same D1
// interface it uses in production. No hosted resources are touched.
export default defineConfig({
	plugins: [
		cloudflareTest(async () => {
			const migrations = await readD1Migrations(
				fileURLToPath(new URL('./migrations', import.meta.url))
			);
			return {
				miniflare: {
					compatibilityDate: '2026-02-14',
					compatibilityFlags: ['nodejs_compat'],
					d1Databases: ['DB'],
					bindings: { TEST_MIGRATIONS: migrations }
				}
			};
		})
	],
	// SvelteKit's $lib alias, so route handlers can be imported and called
	// directly in tests (the kit plugin itself isn't loaded here).
	resolve: {
		alias: { $lib: fileURLToPath(new URL('./src/lib', import.meta.url)) }
	},
	test: {
		include: ['src/**/*.test.ts'],
		setupFiles: ['./test/apply-migrations.ts']
	}
});
