import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

/**
 * Serves an object straight from the R2 binding. Used in dev (and as a same-origin
 * fallback) where there is no public R2 custom domain. In production, images are
 * normally served from the R2 custom domain + Cloudflare transforms instead.
 */
export const GET: RequestHandler = async ({ params, platform }) => {
	const obj = await platform!.env.MEDIA.get(params.key);
	if (!obj) error(404, 'Not found');

	return new Response(await obj.arrayBuffer(), {
		headers: {
			'content-type': obj.httpMetadata?.contentType ?? 'application/octet-stream',
			// no-store in dev so re-uploaded assets (e.g. a rebuilt rustgame wasm)
			// appear immediately without a hard refresh; cache in production.
			'cache-control': dev ? 'no-store' : 'public, max-age=3600',
			etag: obj.httpEtag
		}
	});
};
