import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { getRoasterBySlug, createRoaster, createBean } from '$lib/server/db/coffee';
import { isUniqueConstraintError } from '$lib/server/db/errors';
import { requireApiToken } from '$lib/server/api/auth';
import { slugify } from '$lib/server/form';
import type { RequestHandler } from './$types';

type Body = {
	name?: string;
	roaster?: string;
	origins?: string[];
	process?: string;
};

/**
 * Create a coffee bean, reusing the roaster if one with the same slugified
 * name exists and creating it otherwise. The contract for command-center-mcp's
 * coffee_create_bean tool (typically fed from a photo of the bag). New beans
 * start as drafts — rating, flavors, price, and publishing happen later in
 * /admin/coffee.
 */
export const POST: RequestHandler = async ({ request, platform }) => {
	const denied = await requireApiToken(request, platform?.env.COACH_API_TOKEN);
	if (denied) return denied;

	let body: Body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Body must be JSON' }, { status: 400 });
	}

	const name = typeof body.name === 'string' ? body.name.trim() : '';
	const roasterName = typeof body.roaster === 'string' ? body.roaster.trim() : '';
	if (!name || !roasterName) {
		return json({ error: 'name and roaster are required' }, { status: 400 });
	}
	if (!slugify(name) || !slugify(roasterName)) {
		return json({ error: 'name and roaster must contain letters or digits' }, { status: 400 });
	}
	if (
		body.origins !== undefined &&
		(!Array.isArray(body.origins) || body.origins.some((o) => typeof o !== 'string'))
	) {
		return json({ error: 'origins must be an array of strings' }, { status: 400 });
	}
	const origins = (body.origins ?? []).map((o) => o.trim()).filter(Boolean);
	const process = typeof body.process === 'string' ? body.process.trim() || null : null;

	const db = getDb(platform!.env.DB);

	const roasterSlug = slugify(roasterName);
	let roaster = await getRoasterBySlug(db, roasterSlug);
	const roasterCreated = !roaster;
	if (!roaster) {
		roaster = await createRoaster(db, { slug: roasterSlug, name: roasterName });
	}

	try {
		const bean = await createBean(db, {
			slug: slugify(name),
			name,
			roasterSlug: roaster.slug,
			origins,
			process,
			singleOrigin: origins.length === 1,
			visibility: 'draft' // same convention as /admin/coffee: publish when ready
		});
		return json({ bean, roaster, roaster_created: roasterCreated }, { status: 201 });
	} catch (e) {
		if (isUniqueConstraintError(e)) {
			return json({ error: `A bean named "${name}" already exists` }, { status: 409 });
		}
		throw e;
	}
};
