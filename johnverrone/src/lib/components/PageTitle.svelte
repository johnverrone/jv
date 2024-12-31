<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		children?: Snippet;
	}

	let { href, children }: Props = $props();
</script>

<h1>
	<a {href}>
		{@render children?.()}
	</a>
</h1>

<style>
	h1 {
		margin: 0;
		text-align: center;
		font-family: var(--font-family-heading);
		font-size: 1.5rem;
	}

	h1 a {
		color: black;
		text-decoration: none;
	}
</style>
