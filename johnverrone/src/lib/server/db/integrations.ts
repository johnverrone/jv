import { eq, sql } from 'drizzle-orm';
import type { DB } from './index';
import { oauthToken, type OAuthToken, type NewOAuthToken } from './schema';

const now = sql`(datetime('now'))`;

export type Provider = OAuthToken['provider'];

export async function getOAuthToken(db: DB, provider: Provider) {
	const [row] = await db
		.select()
		.from(oauthToken)
		.where(eq(oauthToken.provider, provider))
		.limit(1);
	return row ?? null;
}

/** Insert or replace the provider's token pair (refresh tokens rotate — persist every pair). */
export async function saveOAuthToken(db: DB, input: Omit<NewOAuthToken, 'updatedAt'>) {
	const [row] = await db
		.insert(oauthToken)
		.values(input)
		.onConflictDoUpdate({
			target: oauthToken.provider,
			set: {
				accessToken: input.accessToken,
				refreshToken: input.refreshToken,
				expiresAt: input.expiresAt,
				athleteId: input.athleteId ?? null,
				scopes: input.scopes ?? null,
				updatedAt: now
			}
		})
		.returning();
	return row;
}

export async function markSynced(db: DB, provider: Provider) {
	await db.update(oauthToken).set({ lastSyncedAt: now }).where(eq(oauthToken.provider, provider));
}

export async function deleteOAuthToken(db: DB, provider: Provider) {
	await db.delete(oauthToken).where(eq(oauthToken.provider, provider));
}
