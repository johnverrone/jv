<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		// The Bevy wasm is ~34 MiB — over Cloudflare's 25 MiB per-asset limit — so
		// it is NOT bundled. The glue + wasm are served at runtime from R2 via the
		// same-origin /media route; init() fetches rustgame_bg.wasm relative to the
		// glue's URL. @vite-ignore keeps Vite from bundling it back in.
		const url = '/media/rustgame/rustgame.js';
		const init = (await import(/* @vite-ignore */ url)).default;
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
