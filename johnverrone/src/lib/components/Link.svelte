<script lang="ts">
	import { spring } from 'svelte/motion';

	export let href: string;

	let size = spring(1);
</script>

<a
	{href}
	on:mouseenter={() => size.set(1.2)}
	on:mouseleave={() => size.set(1)}
	style={`transform: scale(${$size})`}
>
	<slot />
</a>

<style>
	a {
		font-weight: bold;
		color: var(--color-accent);
		text-decoration: none;
	}
</style>
