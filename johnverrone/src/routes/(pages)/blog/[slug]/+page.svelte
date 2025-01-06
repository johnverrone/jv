<script lang="ts">
	import { formatDate } from '$lib/utils';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<article>
	<hgroup>
		<h1>{data.meta.title}</h1>
		<p>{formatDate(data.meta.date)}</p>
	</hgroup>

	<div class="tags">
		{#each data.meta.categories as category}
			<span>&num;{category}</span>
		{/each}
	</div>

	<div class="prose">
		<data.content />
	</div>
</article>

<style>
	article {
		h1 {
			text-transform: capitalize;
		}

		h1 + p {
			font-size: 0.75rem;
			margin-top: 0.5rem;
			color: var(--color-text-secondary);
		}

		.tags {
			display: flex;
			gap: 0.75rem;
			margin-top: 1rem;

			> * {
				font-size: 0.75rem;
				padding: 0.25rem 0.5rem;
				border-radius: var(--border-radius);
				background-color: var(--color-background-secondary);
			}
		}
	}
</style>
