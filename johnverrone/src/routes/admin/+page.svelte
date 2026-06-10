<svelte:head>
	<title>command center</title>
</svelte:head>

<h1>command center</h1>
<p class="subtitle">behind the curtain</p>

<ul class="sections">
	<li><a href="/admin/gear">gear</a></li>
</ul>

<style>
	.subtitle {
		margin: 0.25rem 0 2rem;
		color: var(--color-text-secondary);
		font-family: var(--font-family-mono);
		font-size: 0.85rem;
	}

	.sections {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.sections a {
		display: block;
		padding: 0.85rem 1rem;
		text-decoration: none;
		color: var(--color-text-primary);
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
		font-family: var(--font-family-mono);
	}

	.sections a:hover {
		outline: 2px solid var(--color-accent);
	}
</style>
