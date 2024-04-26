<script lang="ts">
	export let href: string;
</script>

<h1>
	<a {href}>
		<slot />
	</a>
</h1>

<style>
	h1 {
		margin: 0;
		text-align: center;
		font-family: var(--font-family-heading);
		font-size: 1.5rem;
	}

	h1 a {
		color: black;
		text-decoration: none;
	}
</style>
