import type { AuthRequest, OAuthHelpers } from '@cloudflare/workers-oauth-provider';
import { Hono } from 'hono';
import { exchangeGitHubCode, fetchGitHubLogin, getGitHubAuthorizeUrl, type Props } from './github-oauth';
import {
	addApprovedClient,
	bindStateToSession,
	createOAuthState,
	generateCSRFProtection,
	isClientApproved,
	OAuthError,
	renderApprovalDialog,
	validateCSRFToken,
	validateOAuthState
} from './workers-oauth-utils';

// Single-user gate — mirrors the `johnverrone.com` admin login
// (src/routes/auth/github/callback/+server.ts): only this GitHub account may
// ever complete authorization, regardless of who owns the MCP client.
const ALLOWED_LOGIN = 'johnverrone';

const app = new Hono<{ Bindings: Env & { OAUTH_PROVIDER: OAuthHelpers } }>();

app.get('/authorize', async (c) => {
	const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw);
	const { clientId } = oauthReqInfo;
	if (!clientId) return c.text('Invalid request', 400);

	if (await isClientApproved(c.req.raw, clientId, c.env.COOKIE_ENCRYPTION_KEY)) {
		const { stateToken } = await createOAuthState(oauthReqInfo, c.env.OAUTH_KV);
		const { setCookie: sessionBindingCookie } = await bindStateToSession(stateToken);
		return redirectToGithub(c.env.GITHUB_CLIENT_ID, c.req.raw, stateToken, {
			'Set-Cookie': sessionBindingCookie
		});
	}

	const { token: csrfToken, setCookie } = generateCSRFProtection();

	return renderApprovalDialog(c.req.raw, {
		client: await c.env.OAUTH_PROVIDER.lookupClient(clientId),
		csrfToken,
		server: {
			name: 'johnverrone command center',
			description: 'Personal data — health coach plan/logs/habits, guitar journal/plan/songs.'
		},
		setCookie,
		state: { oauthReqInfo }
	});
});

app.post('/authorize', async (c) => {
	try {
		const formData = await c.req.raw.formData();
		validateCSRFToken(formData, c.req.raw);

		const encodedState = formData.get('state');
		if (!encodedState || typeof encodedState !== 'string') {
			return c.text('Missing state in form data', 400);
		}

		let state: { oauthReqInfo?: AuthRequest };
		try {
			state = JSON.parse(atob(encodedState));
		} catch (_e) {
			return c.text('Invalid state data', 400);
		}
		if (!state.oauthReqInfo || !state.oauthReqInfo.clientId) {
			return c.text('Invalid request', 400);
		}

		const approvedClientCookie = await addApprovedClient(
			c.req.raw,
			state.oauthReqInfo.clientId,
			c.env.COOKIE_ENCRYPTION_KEY
		);
		const { stateToken } = await createOAuthState(state.oauthReqInfo, c.env.OAUTH_KV);
		const { setCookie: sessionBindingCookie } = await bindStateToSession(stateToken);

		const headers = new Headers();
		headers.append('Set-Cookie', approvedClientCookie);
		headers.append('Set-Cookie', sessionBindingCookie);

		return redirectToGithub(c.env.GITHUB_CLIENT_ID, c.req.raw, stateToken, Object.fromEntries(headers));
	} catch (error: any) {
		if (error instanceof OAuthError) return error.toResponse();
		return c.text(`Internal server error: ${error.message}`, 500);
	}
});

function redirectToGithub(
	clientId: string,
	request: Request,
	stateToken: string,
	headers: Record<string, string> = {}
) {
	return new Response(null, {
		status: 302,
		headers: {
			...headers,
			location: getGitHubAuthorizeUrl({
				clientId,
				redirectUri: new URL('/callback', request.url).href,
				state: stateToken
			})
		}
	});
}

/**
 * GitHub OAuth callback. Validates state (KV + session-bound cookie per
 * workers-oauth-utils), exchanges the code, checks the GitHub login against
 * ALLOWED_LOGIN, then hands a token back to the MCP client via
 * completeAuthorization. `login` becomes `this.props.login` inside CoachMCP.
 */
app.get('/callback', async (c) => {
	let oauthReqInfo: AuthRequest;
	let clearSessionCookie: string;
	try {
		const result = await validateOAuthState(c.req.raw, c.env.OAUTH_KV);
		oauthReqInfo = result.oauthReqInfo;
		clearSessionCookie = result.clearCookie;
	} catch (error: any) {
		if (error instanceof OAuthError) return error.toResponse();
		return c.text('Internal server error', 500);
	}
	if (!oauthReqInfo.clientId) return c.text('Invalid OAuth request data', 400);

	const [accessToken, errResponse] = await exchangeGitHubCode({
		clientId: c.env.GITHUB_CLIENT_ID,
		clientSecret: c.env.GITHUB_CLIENT_SECRET,
		code: c.req.query('code'),
		redirectUri: new URL('/callback', c.req.url).href
	});
	if (errResponse) return errResponse;

	const login = await fetchGitHubLogin(accessToken);
	if (login !== ALLOWED_LOGIN) {
		return c.text('Unauthorized: this coach is not yours.', 403);
	}

	const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
		metadata: { label: login },
		props: { login } satisfies Props,
		request: oauthReqInfo,
		scope: oauthReqInfo.scope,
		userId: login
	});

	const headers = new Headers({ Location: redirectTo });
	if (clearSessionCookie) headers.set('Set-Cookie', clearSessionCookie);
	return new Response(null, { status: 302, headers });
});

export { app as GitHubHandler };
