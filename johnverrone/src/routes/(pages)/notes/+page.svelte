<script lang="ts">
	import type { PageData } from './$types';
	import { formatDate } from '$lib/utils';

	let { data }: { data: PageData } = $props();
</script>

<section class="container">
	{#if data.posts.length}
		<ul class="flex flex-col items-center">
			{#each data.posts as post}
				<li class="post">
					<a href={`/notes/${post.slug}`} class="title">{post.title}</a>
					<p class="date">{formatDate(post.date)}</p>
					<p class="description">{post.description}</p>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="no_posts">no notes yet 🫠</div>
	{/if}
</section>

<style>
	.container {
		max-width: min(90vw, 500px);
		margin: 0 auto;

		.no_posts {
			text-align: center;
		}
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
