/** Props stashed on the OAuth token, available as `this.props` inside CoachMCP. */
export type Props = {
	login: string;
};

export function getGitHubAuthorizeUrl(opts: {
	clientId: string;
	redirectUri: string;
	state: string;
}) {
	const url = new URL('https://github.com/login/oauth/authorize');
	url.searchParams.set('client_id', opts.clientId);
	url.searchParams.set('redirect_uri', opts.redirectUri);
	url.searchParams.set('scope', 'read:user');
	url.searchParams.set('state', opts.state);
	return url.href;
}

/** Exchange a GitHub authorization code for an access token. */
export async function exchangeGitHubCode(opts: {
	clientId: string;
	clientSecret: string;
	code: string | undefined;
	redirectUri: string;
}): Promise<[string, null] | [null, Response]> {
	if (!opts.code) return [null, new Response('Missing code', { status: 400 })];

	const res = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
		body: new URLSearchParams({
			client_id: opts.clientId,
			client_secret: opts.clientSecret,
			code: opts.code,
			redirect_uri: opts.redirectUri
		})
	});
	if (!res.ok) return [null, new Response('Failed to exchange GitHub code', { status: 502 })];

	const data = (await res.json()) as { access_token?: string };
	if (!data.access_token) return [null, new Response('Missing access token', { status: 400 })];
	return [data.access_token, null];
}

/** GitHub login for the given access token. Requires a User-Agent, same as johnverrone.com's own auth. */
export async function fetchGitHubLogin(accessToken: string): Promise<string | null> {
	const res = await fetch('https://api.github.com/user', {
		headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'coach-mcp' }
	});
	if (!res.ok) return null;
	const user = (await res.json()) as { login?: string };
	return user.login ?? null;
}
