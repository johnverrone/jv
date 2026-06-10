/** Trim a form value to a string, or null when empty. */
export function str(value: FormDataEntryValue | null): string | null {
	const s = String(value ?? '').trim();
	return s || null;
}

/** Parse a dollar string ("799" / "799.00") into integer cents, or null. */
export function centsFromDollars(value: FormDataEntryValue | null): number | null {
	const s = String(value ?? '').trim();
	if (!s) return null;
	const dollars = Number(s);
	return Number.isFinite(dollars) ? Math.round(dollars * 100) : null;
}

/** Turn a string into a url-safe slug. */
export function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
