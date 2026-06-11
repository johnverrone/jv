import { dev } from '$app/environment';

/** Content categories — each maps to its own R2 bucket (see wrangler.jsonc). */
export type MediaCategory = 'photos' | 'coffee' | 'rustgame';

/**
 * URL for an object in a per-category R2 bucket, served via the same-origin
 * `/media/<category>/<key>` route. In production, image categories are wrapped
 * in a Cloudflare image transform (resize + auto AVIF/WebP); dev serves the
 * original. (rustgame .js/.wasm are loaded from the raw /media path, not here.)
 */
export function mediaUrl(category: MediaCategory, key: string, opts: { width?: number } = {}): string {
	const path = `/media/${category}/${key}`;
	if (dev) return path;
	const params = [`width=${opts.width ?? 800}`, 'format=auto', 'fit=scale-down'].join(',');
	return `/cdn-cgi/image/${params}${path}`;
}
