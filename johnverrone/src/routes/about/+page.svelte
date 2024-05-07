<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<section class="container">
	<div class="hero-banner" transition:fade>
		<h1>john verrone</h1>
		<p>full time developer. photo/video hobbyist.</p>
	</div>
</section>

<style>
	.container {
		background: url('/profile.jpg');
		background-size: cover;
		background-position: center 57%;
		min-height: 1100px;
	}

	.hero-banner {
		display: flex;
		flex-flow: column;
		align-items: center;

		position: absolute;
		left: 15vw;
		top: 33%;
	}
</style>
