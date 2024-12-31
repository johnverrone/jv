<script lang="ts">
	import { fade } from 'svelte/transition';
	import { spring } from 'svelte/motion';

	interface Props {
		item: { slug: string; name: string };
		index: number;
	}

	let { item, index }: Props = $props();

	let size = spring(1);
</script>

<li
	onmouseenter={() => size.set(1.2)}
	onmouseleave={() => size.set(1)}
	style={`transform: scale(${$size})`}
	transition:fade|global={{ delay: 100 * (index + 1) }}
>
	<a href={item.slug}>{item.name}</a>
</li>

<style>
	li {
		padding: 20px 0;
		text-align: center;
	}

	a {
		text-decoration: none;
		color: black;
	}

	@media screen and (min-width: 35rem) {
		li {
			text-align: right;
		}
	}
</style>
