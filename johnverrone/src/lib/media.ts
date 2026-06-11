/** Content categories — each maps to its own R2 bucket (see wrangler.jsonc). */
export type MediaCategory = 'photos' | 'coffee' | 'rustgame';

/**
 * URL for an object in a per-category R2 bucket, served straight from R2 via the
 * same-origin `/media/<category>/<key>` route. The `?w=` hint is included for
 * future server-side resizing; the route currently ignores it and serves the
 * original.
 *
 * NB: we deliberately do NOT use `/cdn-cgi/image` transforms — those only work on
 * a custom-domain zone with Image Transformations enabled, never on
 * `*.workers.dev`, so they 404 on preview deploys. To resize, wire the
 * `env.IMAGES` binding into the /media route (works on previews too) and honor
 * the `?w=` param.
 */
export function mediaUrl(category: MediaCategory, key: string, opts: { width?: number } = {}): string {
	const path = `/media/${category}/${key}`;
	return opts.width ? `${path}?w=${opts.width}` : path;
}
