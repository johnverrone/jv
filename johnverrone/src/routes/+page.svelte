<script lang="ts">
	import Link from '$lib/components/Link.svelte';
</script>

<svelte:head>
	<title>John Verrone</title>
	<meta name="description" content="Personal blog" />
</svelte:head>

<h1>johnverrone</h1>

<div class="container">
	<p>
		welcome! this site is a mixed bag of things. a home to act as a portfolio for my digital
		hobbies, a database for my coffee reviews and cocktail recipes, a notebook for current musings,
		and whatever else I feel like providing the entire internet access to.
	</p>
	<p>
		as a developer, this site also serves a little side project to learn the latest tech. it is
		constantly changing, but at the moment it is built with SvelteKit and hosted on Vercel. two
		technologies I have enjoyed working with.
	</p>
	<p>cheers,<br />jv</p>
</div>

<ul class="link-container">
	<Link href="/dev">dev</Link>
	<Link href="/coffee">coffee</Link>
	<Link href="/notes">notes</Link>
	<Link href="/photo">photos</Link>
	<Link href="/video">videos</Link>
</ul>

<style>
	.container {
		max-width: 290px;
		margin-inline: auto;

		p {
			margin-bottom: 2rem;
		}
	}

	h1 {
		max-width: 290px;
		margin: 3rem auto;
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
</style>
