import { env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { getDb } from './index';
import {
	listGear,
	getGearBySlug,
	createGear,
	updateGear,
	publishGear,
	unpublishGear,
	deleteGear,
	addMaintenance
} from './gear';

describe('gear data layer (real Miniflare D1)', () => {
	it('runs the full draft → publish → unpublish lifecycle', async () => {
		const db = getDb(env.DB);

		// Create — new items start as draft, active.
		const created = await createGear(db, {
			slug: 'test-strat',
			name: 'Fender Stratocaster',
			category: 'guitar'
		});
		expect(created.id).toBeGreaterThan(0);
		expect(created.visibility).toBe('draft');
		expect(created.status).toBe('active');

		// Public list excludes drafts; admin list sees everything.
		expect(await listGear(db, { publishedOnly: true })).toHaveLength(0);
		expect(await listGear(db)).toHaveLength(1);

		// Publish — appears publicly and gets stamped.
		const published = await publishGear(db, created.id);
		expect(published?.visibility).toBe('published');
		expect(published?.publishedAt).toBeTruthy();
		expect(await listGear(db, { publishedOnly: true })).toHaveLength(1);

		// Maintenance + detail read.
		await addMaintenance(db, created.id, { performedDate: '2026-06-10', type: 'string-change' });
		const detail = await getGearBySlug(db, 'test-strat');
		expect(detail?.item.name).toBe('Fender Stratocaster');
		expect(detail?.maintenance).toHaveLength(1);

		// Unpublish hides it from the public list again.
		await unpublishGear(db, created.id);
		expect(await listGear(db, { publishedOnly: true })).toHaveLength(0);

		// Update a lifecycle field (orthogonal to visibility), then delete.
		await updateGear(db, created.id, { status: 'sold' });
		expect((await getGearBySlug(db, 'test-strat'))?.item.status).toBe('sold');

		await deleteGear(db, created.id);
		expect(await getGearBySlug(db, 'test-strat')).toBeNull();
	});

	it('isolates writes between tests (this test sees a clean table)', async () => {
		const db = getDb(env.DB);
		expect(await listGear(db)).toHaveLength(0);
	});
});
