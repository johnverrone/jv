import {
	App,
	applyDocumentTheme,
	applyHostFonts,
	applyHostStyleVariables,
	type McpUiHostContext
} from '@modelcontextprotocol/ext-apps/app-with-deps';

type ToolResult = Awaited<ReturnType<App['callServerTool']>>;

/** Every tool on this server returns its JSON payload as a single text block. */
function parseResult<T>(result: ToolResult): T {
	const first = result.content?.[0];
	const raw = first && first.type === 'text' ? first.text : '';
	if (result.isError) throw new Error(raw || 'Tool call failed');
	return JSON.parse(raw) as T;
}

function applyContext(ctx: McpUiHostContext | undefined) {
	if (!ctx) return;
	if (ctx.theme) applyDocumentTheme(ctx.theme);
	if (ctx.styles?.variables) applyHostStyleVariables(ctx.styles.variables);
	if (ctx.styles?.css?.fonts) applyHostFonts(ctx.styles.css.fonts);
}

export interface View<T> {
	app: App;
	/** Call a server tool and return its parsed JSON payload. */
	call<R = unknown>(name: string, args?: Record<string, unknown>): Promise<R>;
	/** Tell the model what the user just did in the UI, so the next turn knows. Best-effort. */
	note(text: string): void;
	/** Re-render with fresh data. */
	render(data: T): void;
}

/**
 * Connects to the host and renders `render(data)` whenever the tool that
 * opened this view returns. `render` gets the View so handlers can call
 * other tools (e.g. log a workout, then refetch).
 */
export function createView<T>(name: string, render: (root: HTMLElement, data: T, view: View<T>) => void) {
	const root = document.getElementById('root')!;
	const app = new App({ name, version: '1.0.0' });

	const view: View<T> = {
		app,
		async call(tool, args = {}) {
			return parseResult(await app.callServerTool({ name: tool, arguments: args }));
		},
		note(text) {
			app.updateModelContext({ content: [{ type: 'text', text }] }).catch(() => {});
		},
		render(data) {
			render(root, data, view);
		}
	};

	app.ontoolresult = (result) => {
		try {
			view.render(parseResult<T>(result));
		} catch (e) {
			root.innerHTML = `<p class="error">${esc(String(e instanceof Error ? e.message : e))}</p>`;
		}
	};
	app.onhostcontextchanged = applyContext;

	app.connect().then(() => applyContext(app.getHostContext()));
	return view;
}

/** Escape text for interpolation into innerHTML. */
export function esc(value: unknown): string {
	return String(value ?? '').replace(
		/[&<>"']/g,
		(c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
	);
}

/**
 * Tiny markdown subset for coach prescriptions: paragraphs, `- ` bullet
 * lists, **bold**. Anything fancier renders as plain text, which is fine.
 */
export function md(text: string | null | undefined): string {
	if (!text) return '';
	return text
		.split(/\n{2,}/)
		.map((block) => {
			const lines = block.split('\n');
			if (lines.every((l) => /^\s*[-*] /.test(l))) {
				return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*] /, ''))}</li>`).join('')}</ul>`;
			}
			return `<p>${lines.map(inline).join('<br>')}</p>`;
		})
		.join('');
}

function inline(s: string) {
	return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MODALITY_ICON: Record<string, string> = {
	lift: '🏋️',
	run: '🏃',
	bike: '🚴',
	hiit: '🔥',
	hike: '🥾',
	walk: '🚶',
	mobility: '🧘',
	rest: '😴'
};
