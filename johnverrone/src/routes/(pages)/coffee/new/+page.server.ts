import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { Actions, PageServerLoad } from './$types';
import { getAllRoasters } from '$lib/coffee/api';
import { serializeBeanToYaml } from '$lib/coffee/yaml';
import { createCoffeeBeanPR } from '$lib/coffee/github';
import { normalizeImage } from '$lib/coffee/image';
import storage from '$lib/storage';
import type { CoffeeBean } from '$lib/coffee/types';

export const load: PageServerLoad = async ({ locals }) => {
	const roasters = await getAllRoasters();
	return {
		authenticated: locals.authenticated ?? false,
		roasters
	};
};

function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.authenticated || !locals.githubToken) {
			redirect(302, '/auth/github');
		}

		const data = await request.formData();
		const name = data.get('name') as string;
		const roaster = data.get('roaster') as string;
		const ratingStr = data.get('rating') as string;
		const origins = (data.get('origins') as string)
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		const flavors = (data.get('flavors') as string)
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		const process = (data.get('process') as string) || '';
		const singleOrigin = data.get('single_origin') === 'on';
		const currentlyBrewing = data.get('currently_brewing') === 'on';
		const priceStr = data.get('price_12oz') as string;
		const notes = (data.get('notes') as string) || '';
		const imageFile = data.get('image') as File | null;

		if (!name || !roaster) {
			return fail(400, { error: 'Name and roaster are required' });
		}

		const slug = slugify(name);
		const rating = ratingStr ? parseInt(ratingStr) : null;
		const price = priceStr ? parseFloat(priceStr) : null;

		// Upload image to GCS (normalize to JPEG, handle HEIC, resize)
		let imageUrl = '';
		if (imageFile && imageFile.size > 0) {
			const rawBuffer = Buffer.from(await imageFile.arrayBuffer());
			const { data: buffer } = await normalizeImage(rawBuffer, imageFile.type);

			const gcsPath = `coffee/${slug}.jpg`;
			if (dev) {
				console.log(`[DEV] Would upload image to GCS: ${gcsPath} (${buffer.length} bytes)`);
				imageUrl = `https://placeholder.dev/${gcsPath}`;
			} else {
				const bucket = storage.bucket('johnverrone');
				const file = bucket.file(gcsPath);

				await file.save(buffer, {
					contentType: 'image/jpeg',
					metadata: { cacheControl: 'public, max-age=31536000' }
				});

				imageUrl = `https://storage.googleapis.com/johnverrone/${gcsPath}`;
			}
		}

		const today = new Date().toISOString().split('T')[0];
		const bean: CoffeeBean = {
			name,
			slug,
			roaster,
			rating,
			origins,
			flavors,
			process,
			single_origin: singleOrigin,
			currently_brewing: currentlyBrewing,
			price_12oz: price,
			notes,
			image_url: imageUrl,
			created: today
		};

		const yamlContent = serializeBeanToYaml(bean);
		const prUrl = await createCoffeeBeanPR(locals.githubToken, slug, yamlContent, name);

		return { success: true, prUrl };
	}
} satisfies Actions;
