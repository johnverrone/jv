async function sha256(input: string): Promise<Uint8Array> {
	return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)));
}

/**
 * Constant-time bearer check against COACH_API_TOKEN — the same secret the
 * johnverrone.com coach API uses. One token gates both hops: reaching this
 * MCP server, and this server's outbound calls to /api/coach/*.
 */
export async function checkBearer(request: Request, expected: string | undefined): Promise<boolean> {
	if (!expected) return false;
	const header = request.headers.get('authorization') ?? '';
	const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
	if (!token) return false;

	const [a, b] = await Promise.all([sha256(token), sha256(expected)]);
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
	return diff === 0;
}
