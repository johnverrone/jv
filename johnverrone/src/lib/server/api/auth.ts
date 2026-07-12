import { json } from '@sveltejs/kit';

async function sha256(input: string): Promise<Uint8Array> {
	return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)));
}

/**
 * Bearer-token gate for /api/* — the contract for the command-center-mcp
 * Worker and any other automation calling this site's JSON API.
 *
 * Deliberately independent of locals.authenticated: hooks.server.ts fakes auth
 * in dev, and that bypass must never open these endpoints. Comparison is
 * hash-then-compare so it can't short-circuit on length or content, and works
 * in both workerd and the Node-based dev server (crypto.subtle.timingSafeEqual
 * is workerd-only).
 */
export async function requireApiToken(
	request: Request,
	expected: string | undefined
): Promise<Response | null> {
	if (!expected) {
		return json({ error: 'COACH_API_TOKEN is not configured' }, { status: 500 });
	}
	const header = request.headers.get('authorization') ?? '';
	const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
	if (!token) return json({ error: 'Unauthorized' }, { status: 401 });

	const [a, b] = await Promise.all([sha256(token), sha256(expected)]);
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
	return diff === 0 ? null : json({ error: 'Unauthorized' }, { status: 401 });
}
