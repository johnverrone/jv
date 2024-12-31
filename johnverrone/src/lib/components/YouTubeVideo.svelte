<script lang="ts">
	interface Props {
		title: string;
		videoId: string;
	}

	let { title, videoId }: Props = $props();
</script>

<div class="wrapper">
	<h3>{title}</h3>
	<iframe
		src={`https://www.youtube.com/embed/${videoId}`}
		title="YouTube video player"
		frameBorder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowFullScreen
	></iframe>
</div>

<style>
	.wrapper {
		text-align: center;
	}

	h3 {
		font-family: var(--font-family-heading);
		margin-bottom: 12px;
	}

	iframe {
		width: min(100%, 800px);
		height: 100%;
		aspect-ratio: 16/9;
	}
</style>
