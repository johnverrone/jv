import { env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { getDb } from './index';
import {
	listRoasters,
	createRoaster,
	listBeans,
	createBean,
	publishBean,
	getBeanBySlug
} from './coffee';

describe('coffee data layer (real Miniflare D1)', () => {
	it('roaster + bean with JSON fields and the publish filter', async () => {
		const db = getDb(env.DB);

		const roaster = await createRoaster(db, {
			slug: 'onyx',
			name: 'Onyx Coffee Lab',
			location: 'Rogers, AR'
		});
		expect(roaster.slug).toBe('onyx');
		expect(await listRoasters(db)).toHaveLength(1);

		// Create as draft; origins/flavors are JSON columns, single_origin a boolean.
		const bean = await createBean(db, {
			slug: 'geometry',
			name: 'Geometry',
			roasterSlug: 'onyx',
			origins: ['Ethiopia', 'Colombia'],
			flavors: ['floral', 'citrus'],
			singleOrigin: false,
			price12ozCents: 2200,
			visibility: 'draft'
		});
		expect(bean.visibility).toBe('draft');
		expect(bean.origins).toEqual(['Ethiopia', 'Colombia']);

		// Public filter hides drafts; admin sees all.
		expect(await listBeans(db, { publishedOnly: true })).toHaveLength(0);
		expect(await listBeans(db)).toHaveLength(1);

		await publishBean(db, bean.id);
		expect(await listBeans(db, { publishedOnly: true })).toHaveLength(1);

		const fetched = await getBeanBySlug(db, 'geometry');
		expect(fetched?.flavors).toEqual(['floral', 'citrus']);
		expect(fetched?.singleOrigin).toBe(false);
		expect(fetched?.price12ozCents).toBe(2200);
	});
});
