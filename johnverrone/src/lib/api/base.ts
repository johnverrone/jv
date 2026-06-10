import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';

/**
 * Base URL for the hobbies datastore API (Cloudflare Worker).
 *
 * Defaults to the local `wrangler dev` server in development and the deployed
 * Worker in production. Override with the `PUBLIC_HOBBIES_API_BASE` env var
 * (e.g. to point dev at a deployed Worker, or prod at a preview deployment).
 */
export const HOBBIES_API_BASE =
	env.PUBLIC_HOBBIES_API_BASE ??
	(dev ? 'http://localhost:8787' : 'https://hobbies.johnverrone.workers.dev');
