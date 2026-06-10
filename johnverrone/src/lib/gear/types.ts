export type GearStatus = 'active' | 'stored' | 'sold' | 'retired';

// Row shapes now come from the Drizzle schema ($lib/server/db/schema) and reach
// components via inferred PageData — no hand-maintained interface needed here.

export const GEAR_STATUSES: GearStatus[] = ['active', 'stored', 'sold', 'retired'];

/** cents → "$12.34" (or "—" when null). */
export function formatCents(cents: number | null | undefined): string {
	if (cents == null) return '—';
	return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
