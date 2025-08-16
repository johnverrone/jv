<script lang="ts">
	let mouseX = $state(0);
	let mouseY = $state(0);
	let windowWidth = $state(0);

	function handleMouseMove(event: MouseEvent) {
		mouseX = event.clientX;
		mouseY = event.clientY;
	}

	function handleResize() {
		windowWidth = window.innerWidth;
	}

	// Initialize window width on mount
	$effect(() => {
		if (typeof window !== 'undefined') {
			windowWidth = window.innerWidth;
		}
	});
</script>

<svelte:window on:mousemove={handleMouseMove} on:resize={handleResize} />

<div class="stage-container">
	<div
		class="stage-light stage-light-left"
		style="transform: rotate(calc({Math.atan2(mouseY - 80, mouseX - 80)}rad - 90deg))"
	>
		<div class="light-beam"></div>
		<div class="light-fixture"></div>
	</div>

	<div
		class="stage-light stage-light-right"
		style="transform: rotate(calc({Math.atan2(
			mouseY - 80,
			mouseX - (windowWidth - 80)
		)}rad - 90deg))"
	>
		<div class="light-beam"></div>
		<div class="light-fixture"></div>
	</div>

	<div class="stage-content">
		<h1>JV 2025</h1>
	</div>

	<div class="stage-floor"></div>
</div>

<style>
	.stage-container {
		position: relative;
		min-height: 100vh;
		background:
			radial-gradient(ellipse at bottom, rgba(40, 40, 40, 0.8) 0%, transparent 70%),
			linear-gradient(to bottom, #0a0a0a 0%, #1a1a1a 60%, #2d2d2d 100%);
	}

	.stage-floor {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 200px;
		background: linear-gradient(to bottom, rgba(60, 60, 60, 0.3) 0%, rgba(40, 40, 40, 0.8) 100%);
		border-top: 2px solid rgba(80, 80, 80, 0.5);
	}

	.stage-floor::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 10px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.1) 20%,
			rgba(255, 255, 255, 0.2) 50%,
			rgba(255, 255, 255, 0.1) 80%,
			transparent 100%
		);
	}

	.stage-light {
		position: fixed;
		width: 60px;
		height: 60px;
		transform-origin: center center;
		z-index: 10;
	}

	.stage-light-left {
		top: 50px;
		left: 50px;
	}

	.stage-light-right {
		top: 50px;
		right: 50px;
	}

	.light-fixture {
		width: 60px;
		height: 40px;
		background: linear-gradient(to bottom, #333, #666);
		border-radius: 10px;
		border: 2px solid #888;
		position: relative;
	}

	.light-fixture::after {
		content: '';
		position: absolute;
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%);
		width: 30px;
		height: 15px;
		background: radial-gradient(ellipse, #ffff88 0%, #ffaa00 100%);
		border-radius: 50%;
		box-shadow: 0 0 20px #ffff88;
	}

	.light-beam {
		position: absolute;
		top: 40px;
		left: 50%;
		transform: translateX(-50%);
		width: 100px;
		height: 800px;
		background: radial-gradient(
			ellipse 100px 400px at center top,
			rgba(255, 255, 136, 0.4) 0%,
			rgba(255, 170, 0, 0.25) 30%,
			rgba(255, 255, 136, 0.15) 60%,
			transparent 100%
		);
		clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
		pointer-events: none;
		filter: blur(2px);
	}

	.light-beam::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 120px;
		height: 600px;
		background: radial-gradient(
			ellipse 60px 300px at center top,
			rgba(255, 255, 136, 0.6) 0%,
			rgba(255, 170, 0, 0.4) 40%,
			rgba(255, 255, 136, 0.2) 70%,
			transparent 100%
		);
		clip-path: polygon(35% 0%, 65% 0%, 85% 100%, 15% 100%);
	}

	.stage-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		z-index: 5;
	}

	.stage-content h1 {
		font-size: 4rem;
		font-weight: bold;
		text-shadow: 0 0 20px rgba(255, 255, 136, 0.5);
		margin-bottom: 1rem;
	}
</style>
