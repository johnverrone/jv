<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		href?: string;
		children?: Snippet;
	}

	let { title, href, children }: Props = $props();
</script>

<section class="card">
	<header class="card-header">
		{#if href}
			<a {href}>{title}</a>
		{:else}
			<span>{title}</span>
		{/if}
	</header>
	<div class="card-body">
		{@render children?.()}
	</div>
</section>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;

		min-height: 180px;
		padding: 1.25rem;

		background-color: var(--color-card-bg);
		color: var(--color-card-fg);
		border-radius: var(--border-radius);
	}

	.card-header {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		text-transform: lowercase;
		letter-spacing: 0.03em;
		opacity: 0.6;
	}

	.card-header a {
		color: var(--color-card-fg);
		text-decoration: none;
	}

	.card-header a:hover {
		opacity: 1;
		text-decoration: underline;
	}

	.card-body {
		flex: 1;
	}
</style>
