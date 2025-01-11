<svelte:head>
	<title>John Verrone | work</title>
	<meta name="description" content="Work projects" />
</svelte:head>

<ul class="list-container">
	<li class="list-item">
		<a href="https://github.com/johnverrone/bunkie-bois" class="link" target="_blank">
			<h3>Bunkie Bois</h3>
		</a>
	</li>
	<li class="list-item">
		<a href="https://github.com/johnverrone/aoc" class="link" target="_blank">
			<h3>Advent of Code</h3>
		</a>
	</li>
</ul>

<style>
	.list-container {
		list-style-type: none;
		padding: 0;

		display: grid;
		gap: 12px;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.list-item {
		height: 200px;
		background-color: var(--color-card-bg);
		border-radius: var(--border-radius);
	}

	.list-item h3 {
		font-family: var(--font-family-mono);
		text-transform: lowercase;
	}

	.list-item .link {
		width: 100%;
		height: 100%;
		color: var(--color-card-fg);
		text-decoration: none;

		display: grid;
		place-items: center;
	}
</style>
