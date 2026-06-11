import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { R2Bucket } from '@cloudflare/workers-types';
import type { RequestHandler } from './$types';

const BUCKET_BY_CATEGORY: Record<string, 'PHOTOS' | 'COFFEE' | 'GAME'> = {
	photos: 'PHOTOS',
	coffee: 'COFFEE',
	rustgame: 'GAME'
};

/**
 * Serves an object from the per-category R2 bucket. Same-origin in dev and prod;
 * production image requests usually arrive pre-wrapped in /cdn-cgi/image/ (see
 * $lib/media.mediaUrl), which transforms the response this route returns.
 */
export const GET: RequestHandler = async ({ params, platform }) => {
	const binding = BUCKET_BY_CATEGORY[params.category];
	if (!binding) error(404, 'Unknown media category');

	const obj = await (platform!.env[binding] as R2Bucket).get(params.key);
	if (!obj) error(404, 'Not found');

	return new Response(await obj.arrayBuffer(), {
		headers: {
			'content-type': obj.httpMetadata?.contentType ?? 'application/octet-stream',
			// no-store in dev so re-uploaded assets appear immediately; cache in prod.
			'cache-control': dev ? 'no-store' : 'public, max-age=3600',
			etag: obj.httpEtag
		}
	});
};
