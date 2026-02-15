<script>
	import SvelteMarked from 'svelte-marked';

	let { data } = $props();
</script>

<article>
	<h1>Guitar Progress</h1>
	<section>
		<SvelteMarked source={data.progress} />
	</section>

	<h1>Practice Plan</h1>
	<section>
		<SvelteMarked source={data.plan} />
	</section>
</article>
