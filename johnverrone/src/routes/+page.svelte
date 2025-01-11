<script lang="ts">
	import Link from '$lib/components/Link.svelte';
</script>

<svelte:head>
	<title>John Verrone</title>
	<meta name="description" content="Personal blog" />
</svelte:head>

<div class="container">
	<h1>johnverrone</h1>

	<section>
		<p>
			welcome! this site is a mixed bag of things. a home to act as a portfolio for my digital
			hobbies, a database for my coffee reviews and cocktail recipes, a notebook for current
			musings, and whatever else I feel like providing the entire internet access to.
		</p>
		<p>
			as a developer, this site also serves a little side project to learn the latest tech. it is
			constantly changing, but at the moment it is built with SvelteKit and hosted on Vercel. two
			technologies I have enjoyed working with.
		</p>
		<p>cheers,<br />jv</p>
	</section>

	<ul class="link-container">
		<Link href="/dev">dev</Link>
		<Link href="/coffee">coffee</Link>
		<Link href="/notes">notes</Link>
		<Link href="/photo">photos</Link>
		<Link href="/video">videos</Link>
	</ul>
</div>

<style>
	.container {
		padding: 50px;
		max-width: 450px;
		margin-inline: auto;

		p {
			margin-bottom: 2rem;
		}
	}

	h1 {
		margin-bottom: 3rem;
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

	@media screen and (min-width: 450px) {
		h1 {
			text-align: center;
		}

		.link-container {
			flex-flow: row;
			justify-content: center;
		}
	}
</style>
