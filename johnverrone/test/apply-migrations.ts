import { applyD1Migrations, env } from 'cloudflare:test';

// Apply migrations/0001_gear.sql + 0002_publish.sql to the test D1 once, before
// any test runs. Isolated storage forks from this seed, so each test sees the
// schema but its writes are rolled back between tests.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
