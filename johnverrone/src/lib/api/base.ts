import { env } from '$env/dynamic/public';

/**
 * Base URL for the legacy `hobbies` datastore Worker — still serves the guitar
 * (and golf) reads; coffee has moved to D1. Defaults to the deployed Worker so
 * `bun run dev` works without running the hobbies Worker locally. Override with
 * `PUBLIC_HOBBIES_API_BASE` (e.g. http://localhost:8787 to run it locally).
 */
export const HOBBIES_API_BASE =
	env.PUBLIC_HOBBIES_API_BASE ?? 'https://hobbies.johnverrone.workers.dev';
