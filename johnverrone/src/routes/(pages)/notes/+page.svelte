<script lang="ts">
	import type { PageData } from './$types';
	import { formatDate } from '$lib/utils';

	let { data }: { data: PageData } = $props();
</script>

<section class="container">
	<ul class="flex flex-col items-center">
		{#each data.posts as post}
			<li class="post">
				<a href={`/notes/${post.slug}`} class="title">{post.title}</a>
				<p class="date">{formatDate(post.date)}</p>
				<p class="description">{post.description}</p>
			</li>
		{/each}
	</ul>
</section>

<style>
	.container {
		max-width: min(90vw, 500px);
		margin: 0 auto;
	}

	ul {
		list-style-type: none;
		padding-left: 0;
	}

	.date {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}
</style>
