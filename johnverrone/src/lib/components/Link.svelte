<script lang="ts">
	import { Spring } from 'svelte/motion';
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		children?: Snippet;
	}

	let { href, children }: Props = $props();

	let size = new Spring(1);
</script>

<a
	{href}
	onmouseenter={() => size.set(1.2)}
	onmouseleave={() => size.set(1)}
	style={`transform: scale(${size.current})`}
>
	{@render children?.()}
</a>

<style>
	a {
		font-weight: bold;
		color: var(--color-accent);
		text-decoration: none;
	}
</style>
