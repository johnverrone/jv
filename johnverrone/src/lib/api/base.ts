import { env } from '$env/dynamic/public';

/**
 * Base URL for the legacy `hobbies` datastore Worker. Guitar and coffee have
 * both moved to D1; this only remains for src/lib/golf and src/lib/software,
 * neither of which is wired to any route (dead code). Override with
 * `PUBLIC_HOBBIES_API_BASE` (e.g. http://localhost:8787 to run it locally).
 */
export const HOBBIES_API_BASE =
	env.PUBLIC_HOBBIES_API_BASE ?? 'https://hobbies.johnverrone.workers.dev';
