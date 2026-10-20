import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import todayHtml from '../dist/views/today.html';
import planHtml from '../dist/views/plan.html';
import songsHtml from '../dist/views/songs.html';

// MCP Apps (https://github.com/modelcontextprotocol/ext-apps): a tool whose
// _meta points at a ui:// resource gets that HTML rendered inline by hosts
// that support it; everyone else just sees the tool's JSON text as before.
// The HTML is built from views/ by scripts/build-views.ts.
//
// Registered against the 1.x SDK's McpServer directly rather than via
// ext-apps' registerAppTool/registerAppResource helpers, which target the
// 2.x SDK. The wire format is the same.

const RESOURCE_MIME_TYPE = 'text/html;profile=mcp-app';

export const VIEWS = {
	today: { uri: 'ui://command-center/today.html', name: 'Coach today', html: todayHtml },
	plan: { uri: 'ui://command-center/plan.html', name: 'Coach weekly plan', html: planHtml },
	songs: { uri: 'ui://command-center/songs.html', name: 'Guitar repertoire', html: songsHtml }
} as const;

/** `_meta` for a tool that should render `view`. Sets the legacy flat key too for older hosts. */
export function uiMeta(view: keyof typeof VIEWS) {
	const { uri } = VIEWS[view];
	return { ui: { resourceUri: uri }, 'ui/resourceUri': uri };
}

export function registerViews(server: McpServer) {
	for (const { uri, name, html } of Object.values(VIEWS)) {
		server.registerResource(name, uri, { mimeType: RESOURCE_MIME_TYPE }, async () => ({
			contents: [{ uri, mimeType: RESOURCE_MIME_TYPE, text: html }]
		}));
	}
}
