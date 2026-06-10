<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		const init = (await import('$rustgame/rustgame.js')).default;
		await init();
	});
</script>

<svelte:head>
	<title>explore</title>
</svelte:head>

<canvas id="bevy-canvas"></canvas>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
		height: 100%;
		width: 100%;
	}

	canvas {
		display: block;
		width: 100vw;
		height: 100vh;
	}
</style>
