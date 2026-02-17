<script>
	import SvelteMarked from 'svelte-marked';

	let { data } = $props();
</script>

<div class="container">
	<a href="/notes" class="back">back</a>

	<article>
		<section class="prose">
			<SvelteMarked source={data.progress} />
		</section>

		<hr />

		<section class="prose">
			<SvelteMarked source={data.plan} />
		</section>
	</article>
</div>

<style>
	.container {
		max-width: min(90vw, 500px);
		margin: 0 auto;

		.back {
			display: block;
			margin-bottom: 1rem;
		}
	}

	hr {
		margin: 3rem 0;
	}
</style>
