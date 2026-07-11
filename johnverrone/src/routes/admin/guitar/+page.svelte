<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let editingId = $state<number | null>(null);
	let adding = $state(false);
</script>

<svelte:head>
	<title>journal · guitar · command center</title>
</svelte:head>

<div class="head">
	<h1>practice journal</h1>
	<button class="toggle" onclick={() => (adding = !adding)}>
		{adding ? 'cancel' : '+ add entry'}
	</button>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}

{#if adding}
	{@render entryForm(null)}
{/if}

{#if data.entries.length === 0}
	<p class="empty">No journal entries yet.</p>
{:else}
	<ul class="list">
		{#each data.entries as entry (entry.id)}
			{#if editingId === entry.id}
				{@render entryForm(entry)}
			{:else}
				<li>
					<div class="row">
						<span class="date">{entry.date}</span>
						<span class="theme">{entry.theme}</span>
						<span class="dur">{entry.durationMin}′</span>
						<span class="actions">
							<button class="link" onclick={() => (editingId = entry.id)}>edit</button>
							<form method="POST" action="?/delete" use:enhance class="inline">
								<input type="hidden" name="id" value={entry.id} />
								<button class="link danger" type="submit">delete</button>
							</form>
						</span>
					</div>
				</li>
			{/if}
		{/each}
	</ul>
{/if}

{#snippet entryForm(entry: (typeof data.entries)[number] | null)}
	<form
		method="POST"
		action={entry ? '?/update' : '?/create'}
		class="edit-form"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				editingId = null;
				adding = false;
			};
		}}
	>
		{#if entry}<input type="hidden" name="id" value={entry.id} />{/if}
		<div class="grid">
			<label>
				date<input name="date" type="date" required value={entry?.date ?? ''} />
			</label>
			<label>
				duration (min)<input
					name="duration_min"
					type="number"
					min="1"
					required
					value={entry?.durationMin ?? ''}
				/>
			</label>
			<label class="wide">
				theme<input name="theme" required value={entry?.theme ?? ''} />
			</label>
			<label class="wide">
				content (markdown)<textarea name="content" rows="8" required
					>{entry?.content ?? ''}</textarea
				>
			</label>
		</div>
		<div class="form-actions">
			<button type="submit" class="save">{entry ? 'save' : 'add entry'}</button>
			{#if entry}
				<button type="button" class="toggle" onclick={() => (editingId = null)}>cancel</button>
			{/if}
		</div>
	</form>
{/snippet}

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
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		border: none;
	}

	.edit-form {
		margin-bottom: 1rem;
		padding: 1.25rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
	}

	.grid {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-family: var(--font-family-mono);
		font-size: 0.7rem;
		text-transform: lowercase;
		color: var(--color-text-secondary);
	}

	.wide {
		grid-column: 1 / -1;
	}

	input,
	textarea {
		font-family: var(--font-family-body);
		font-size: 0.9rem;
		padding: 0.4rem 0.5rem;
		border: 1px solid var(--color-hint);
		border-radius: 4px;
		background: var(--color-background);
	}

	textarea {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
	}

	.form-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem 1rem;
		padding: 0.85rem 1rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
	}

	.date {
		font-family: var(--font-family-mono);
		font-size: 0.85rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.theme {
		flex: 1 1 100%;
		order: 3;
		font-size: 0.9rem;
	}

	.dur {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		white-space: nowrap;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		margin-left: auto;
	}

	@media (min-width: 30rem) {
		.theme {
			flex: 1 1 auto;
			order: 0;
		}
	}

	.inline {
		display: inline;
	}

	.link {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		color: var(--color-accent);
	}

	.link.danger {
		color: #c0392b;
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
