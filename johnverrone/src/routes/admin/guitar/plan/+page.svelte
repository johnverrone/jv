<script lang="ts">
	import { enhance } from '$app/forms';
	import SvelteMarked from 'svelte-marked';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let editing = $state(false);
</script>

<svelte:head>
	<title>plan · guitar · command center</title>
</svelte:head>

<div class="head">
	<h1>practice plan</h1>
	<button class="toggle" onclick={() => (editing = !editing)}>
		{editing ? 'cancel' : 'edit'}
	</button>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}

{#if editing}
	<form
		method="POST"
		action="?/save"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				editing = false;
			};
		}}
	>
		<textarea name="content" rows="20">{data.plan ?? ''}</textarea>
		<button type="submit" class="save">save plan</button>
	</form>
{:else if data.plan}
	<article class="prose">
		<SvelteMarked source={data.plan} />
	</article>
{:else}
	<p class="empty">No plan yet.</p>
{/if}

<style>
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.toggle,
	.save {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		padding: 0.4rem 0.75rem;
		border: 1px solid var(--color-background-secondary);
		border-radius: var(--border-radius);
		background: none;
		cursor: pointer;
	}

	.save {
		margin-top: 0.75rem;
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		border: none;
	}

	textarea {
		width: 100%;
		box-sizing: border-box;
		font-family: var(--font-family-mono);
		font-size: 0.85rem;
		padding: 0.75rem;
		border: 1px solid var(--color-hint);
		border-radius: var(--border-radius);
		background: var(--color-background);
	}

	.prose {
		max-width: 650px;
	}

	.empty {
		color: var(--color-text-secondary);
		font-family: var(--font-family-mono);
		font-size: 0.85rem;
	}

	.error {
		color: #c0392b;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		margin: 0 0 0.75rem;
	}
</style>
