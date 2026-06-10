import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';

/**
 * Public base for media (R2). In production this is the R2 custom domain
 * (e.g. https://media.johnverrone.com) where Cloudflare image transformations
 * are available. In dev there is no such domain, so images are served from the
 * local `/media/<key>` Worker route (originals, no transform). Override with
 * `PUBLIC_MEDIA_BASE`.
 */
const MEDIA_BASE = env.PUBLIC_MEDIA_BASE ?? (dev ? '' : 'https://media.johnverrone.com');

/**
 * URL for an R2 media key. In production, wraps the custom domain in a
 * Cloudflare image transform (resize + auto format/AVIF/WebP). In dev, points
 * at the local serving route with no transform.
 */
export function mediaUrl(key: string, opts: { width?: number } = {}): string {
	if (!MEDIA_BASE) return `/media/${key}`;
	const params = [`width=${opts.width ?? 800}`, 'format=auto', 'fit=scale-down'].join(',');
	return `${MEDIA_BASE}/cdn-cgi/image/${params}/${key}`;
}
