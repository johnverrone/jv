<script lang="ts">
	import type { PageData } from './$types';
	import { formatDate } from '$lib/utils';

	let { data }: { data: PageData } = $props();
</script>

<section class="container">
	<ul class="topics">
		<li class="topic">
			<a href="/guitar" class="topic-link">
				<h3>guitar</h3>
			</a>
		</li>
	</ul>

	{#if data.posts.length}
		<h3>misc</h3>
		<ul class="flex flex-col items-center">
			{#each data.posts as post}
				<li class="post">
					<a href={`/notes/${post.slug}`} class="title">{post.title}</a>
					<p class="date">{formatDate(post.date)}</p>
					<p class="description">{post.description}</p>
				</li>
			{/each}
		</ul>
	{/if}
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

	.topics {
		list-style-type: none;
		padding: 0;
		margin-bottom: 2rem;

		display: grid;
		gap: 12px;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.topic {
		height: 200px;
		background-color: var(--color-card-bg);
		border-radius: var(--border-radius);
	}

	.topic h3 {
		font-family: var(--font-family-mono);
		text-transform: lowercase;
	}

	.topic-link {
		width: 100%;
		height: 100%;
		color: var(--color-card-fg);
		text-decoration: none;

		display: grid;
		place-items: center;
	}

	.date {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}
</style>
