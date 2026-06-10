import { env } from '$env/dynamic/private';
import { HOBBIES_API_BASE } from '$lib/api/base';

interface RequestInit {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: unknown;
}

/**
 * Single transport for the private, bearer-guarded `/admin` API on the hobbies
 * Worker. Lives under `$lib/server` so the token can never bundle into client
 * code. Every command-center domain (gear now; finance/calendar later) reuses
 * this — call it only from server-side `load`/actions.
 *
 *   await hobbiesWrite('/gear', { method: 'POST', body });
 *   await hobbiesWrite<{ items: Gear[] }>('/gear', { method: 'GET' });
 */
export async function hobbiesWrite<T = unknown>(
	path: string,
	init: RequestInit
): Promise<T | null> {
	const res = await fetch(`${HOBBIES_API_BASE}/admin${path}`, {
		method: init.method,
		headers: {
			Authorization: `Bearer ${env.HOBBIES_WRITE_TOKEN}`,
			...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {})
		},
		body: init.body !== undefined ? JSON.stringify(init.body) : undefined
	});

	if (!res.ok) {
		throw new Error(`hobbies admin ${init.method} ${path} → ${res.status}: ${await res.text()}`);
	}

	return res.status === 204 ? null : ((await res.json()) as T);
}
