<svelte:head>
	<title>command center</title>
</svelte:head>

<h1>command center</h1>

<ul class="sections">
	<li><a href="/admin/gear">gear</a></li>
	<li><a href="/admin/photos">photos</a></li>
	<li><a href="/admin/coffee">coffee</a></li>
</ul>

<style>
	h1 {
		margin-bottom: 2rem;
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
