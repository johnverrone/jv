import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

interface RequestInit {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: unknown;
}

/**
 * Base URL for the command-center API — a private Cloudflare Worker that lives
 * in the `jv` monorepo under `command-center/` (D1-backed gear, later
 * finance/calendar). Server-to-server only, so it can be a private env var.
 * Defaults to the local `wrangler dev` server (port 8788) in development and
 * the deployed Worker in production. Override with `COMMAND_CENTER_API_BASE`
 * (e.g. to point dev at the deployed Worker, or prod at a custom domain).
 */
const COMMAND_CENTER_BASE =
	env.COMMAND_CENTER_API_BASE ??
	(dev ? 'http://localhost:8788' : 'https://command-center.johnverrone.workers.dev');

/**
 * Single transport for the private, bearer-guarded command-center API. Lives
 * under `$lib/server` so the token can never bundle into client code. Every
 * command-center domain (gear now; finance/calendar later) reuses this — call
 * it only from server-side `load`/actions.
 *
 *   await hobbiesWrite('/gear', { method: 'POST', body });
 *   await hobbiesWrite<{ items: Gear[] }>('/gear', { method: 'GET' });
 */
export async function hobbiesWrite<T = unknown>(
	path: string,
	init: RequestInit
): Promise<T | null> {
	const res = await fetch(`${COMMAND_CENTER_BASE}${path}`, {
		method: init.method,
		headers: {
			Authorization: `Bearer ${env.HOBBIES_WRITE_TOKEN}`,
			...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {})
		},
		body: init.body !== undefined ? JSON.stringify(init.body) : undefined
	});

	if (!res.ok) {
		throw new Error(
			`command-center ${init.method} ${path} → ${res.status}: ${await res.text()}`
		);
	}

	return res.status === 204 ? null : ((await res.json()) as T);
}
