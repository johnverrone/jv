// Wrangler bundles *.html imports as text (default module rules).
declare module '*.html' {
	const content: string;
	export default content;
}
