/**
 * True if `e` (or a wrapped cause) is a UNIQUE constraint violation.
 *
 * Drizzle wraps D1 errors in a `DrizzleQueryError` whose own message is just
 * "Failed query: ..." — the actual "UNIQUE constraint failed" text lives on
 * `error.cause` (sometimes `error.cause.cause`), not the top-level error, so
 * `String(e).includes('UNIQUE')` alone never matches.
 */
export function isUniqueConstraintError(e: unknown): boolean {
	let cur: unknown = e;
	for (let i = 0; i < 3 && cur != null; i++) {
		if (String(cur).includes('UNIQUE')) return true;
		cur = (cur as { cause?: unknown }).cause;
	}
	return false;
}
