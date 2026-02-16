<script>
	import SvelteMarked from 'svelte-marked';

	let { data } = $props();
</script>

<article>
	<section class="prose">
		<SvelteMarked source={data.progress} />
	</section>

	<hr />

	<section class="prose">
		<SvelteMarked source={data.plan} />
	</section>
</article>

<style>
	article {
		max-width: min(90vw, 500px);
		margin: 0 auto;
	}

	hr {
		margin: 3rem 0;
	}
</style>
