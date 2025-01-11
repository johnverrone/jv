<script lang="ts">
	import { page } from '$app/state';
</script>

<div>
	<h1>🥴 {page.error?.message} 🥴</h1>

	<a href="/notes">back to notes</a>
</div>

<style>
	div {
		text-align: center;

		h1 {
			margin-bottom: 2rem;
		}
	}
</style>
