<script>
	import SvelteMarked from 'svelte-marked';

	let { data } = $props();

	const formattedDate = $derived.by(() => {
		const date = new Date(data.entry.date + 'T12:00:00');
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	});
</script>

<div class="entry">
	<a href="/guitar/journal" class="back">&larr; all entries</a>

	<header>
		<h1>{formattedDate}</h1>
		<div class="meta">
			<span>{data.entry.duration} min</span>
			<span class="separator">&middot;</span>
			<span>{data.entry.theme}</span>
		</div>
	</header>

	<article class="prose">
		<SvelteMarked source={data.entry.content} />
	</article>
</div>

<style>
	.back {
		display: inline-block;
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
		text-decoration: none;
		margin-bottom: 1.5rem;
	}

	.back:hover {
		color: var(--color-accent);
	}

	header {
		margin-bottom: 2rem;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	.meta {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		font-family: var(--font-family-mono);
	}

	.separator {
		margin: 0 0.5rem;
	}

	.entry {
		max-width: 650px;
	}
</style>
