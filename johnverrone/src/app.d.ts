import 'unplugin-icons/types/svelte';
import type { D1Database, R2Bucket, Fetcher } from '@cloudflare/workers-types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			authenticated?: boolean;
			githubToken?: string;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DB: D1Database;
				PHOTOS: R2Bucket;
				COFFEE: R2Bucket;
				GAME: R2Bucket;
				HOBBIES: Fetcher;
				/** Bearer token for /api/coach (wrangler secret; .dev.vars locally). */
				COACH_API_TOKEN: string;
			};
		}
	}
}

export {};
