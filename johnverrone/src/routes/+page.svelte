<script lang="ts">
	import Link from '$lib/components/Link.svelte';
</script>

<svelte:head>
	<title>John Verrone</title>
	<meta name="description" content="Personal blog" />
</svelte:head>

<h1>johnverrone</h1>

<ul class="link-container">
	<Link href="/work">dev</Link>
	<Link href="/photo">photos</Link>
	<Link href="/video">videos</Link>
	<Link href="/coffee">coffee</Link>
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
</style>
