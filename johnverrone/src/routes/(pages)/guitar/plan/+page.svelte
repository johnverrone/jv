<script>
	import SvelteMarked from 'svelte-marked';

	let { data } = $props();
</script>

<article class="prose">
	<SvelteMarked source={data.plan} />
</article>

<style>
	article {
		max-width: 650px;
	}
</style>
