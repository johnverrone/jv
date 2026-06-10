export type GearStatus = 'active' | 'stored' | 'sold' | 'retired';

export interface GearItem {
	id: number;
	slug: string;
	name: string;
	category: string;
	manufacturer: string | null;
	model: string | null;
	serial_number: string | null;
	acquired_date: string | null;
	acquired_price_cents: number | null;
	status: GearStatus;
	notes: string | null;
	image_url: string | null;
	created_at: string;
	updated_at: string;
}

export interface MaintenanceLog {
	id: number;
	gear_item_id: number;
	performed_date: string;
	type: string;
	description: string | null;
	cost_cents: number | null;
	performed_by: string | null;
	created_at: string;
}

export const GEAR_STATUSES: GearStatus[] = ['active', 'stored', 'sold', 'retired'];

/** cents → "$12.34" (or "—" when null). */
export function formatCents(cents: number | null | undefined): string {
	if (cents == null) return '—';
	return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
