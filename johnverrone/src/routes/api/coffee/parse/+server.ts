import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Paused during the Vercel -> Cloudflare migration. This endpoint relied on
// server-side sharp + heic-convert (Node-only) to normalize a bag photo before
// sending it to Claude's vision API. It returns once coffee adopts the same
// client-side HEIC decode + Cloudflare Images pipeline as /admin/photos.
export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.authenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	return json(
		{ error: 'Coffee photo parsing is temporarily disabled while image handling moves to Cloudflare.' },
		{ status: 503 }
	);
};
