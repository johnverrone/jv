<svelte:head>
	<title>John Verrone</title>
	<meta name="description" content="Personal blog" />
</svelte:head>

<h1>johnverrone</h1>

<ul class="link-container">
	<a href="/work">dev</a>
	<a href="/photo">photos</a>
	<a href="/video">videos</a>
	<a href="/coffee">coffee</a>
</ul>

<style>
	h1 {
		width: 100%;
		margin: 0;
		margin-block: 3rem;
		text-align: center;
		font-family: var(--font-family-heading);
		font-size: 1.5rem;
	}

	.link-container {
		margin: 0;
		padding: 0;

		display: flex;
		flex-flow: column;
		gap: 1rem;
		align-items: center;
	}

	a {
		font-weight: bold;
		color: var(--color-accent);
		text-decoration: none;
	}
</style>
