import 'unplugin-icons/types/svelte';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

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
				MEDIA: R2Bucket;
			};
		}
	}
}

export {};
