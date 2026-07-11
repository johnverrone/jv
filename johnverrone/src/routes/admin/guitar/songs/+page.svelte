<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let editingId = $state<number | null>(null);
	let adding = $state(false);

	const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;
</script>

<svelte:head>
	<title>songs · guitar · command center</title>
</svelte:head>

<div class="head">
	<h1>song list</h1>
	<button class="toggle" onclick={() => (adding = !adding)}>
		{adding ? 'cancel' : '+ add song'}
	</button>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}

{#if adding}
	{@render songForm(null)}
{/if}

{#if data.songs.length === 0}
	<p class="empty">No songs yet.</p>
{:else}
	<ul class="list">
		{#each data.songs as song (song.id)}
			{#if editingId === song.id}
				{@render songForm(song)}
			{:else}
				<li>
					<div class="row">
						<span class="title">{song.title}</span>
						<span class="artist">{song.artist}</span>
						<span class="difficulty">{song.difficulty}</span>
						<span class="progress">{song.progress}</span>
						<span class="actions">
							<button class="link" onclick={() => (editingId = song.id)}>edit</button>
							<form method="POST" action="?/delete" use:enhance class="inline">
								<input type="hidden" name="id" value={song.id} />
								<button class="link danger" type="submit">delete</button>
							</form>
						</span>
					</div>
				</li>
			{/if}
		{/each}
	</ul>
{/if}

{#snippet songForm(song: (typeof data.songs)[number] | null)}
	<form
		method="POST"
		action={song ? '?/update' : '?/create'}
		class="edit-form"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				editingId = null;
				adding = false;
			};
		}}
	>
		{#if song}<input type="hidden" name="id" value={song.id} />{/if}
		<div class="grid">
			<label>title<input name="title" required value={song?.title ?? ''} /></label>
			<label>artist<input name="artist" required value={song?.artist ?? ''} /></label>
			<label>
				difficulty
				<select name="difficulty" required value={song?.difficulty ?? 'Beginner'}>
					{#each DIFFICULTIES as d (d)}
						<option value={d}>{d}</option>
					{/each}
				</select>
			</label>
			<label>genre<input name="genre" required value={song?.genre ?? ''} /></label>
			<label>key<input name="key" required value={song?.key ?? ''} /></label>
			<label>tuning<input name="tuning" required value={song?.tuning ?? ''} /></label>
			<label>bpm<input name="bpm" type="number" min="1" required value={song?.bpm ?? ''} /></label>
			<label>capo<input name="capo" type="number" min="0" value={song?.capo ?? ''} /></label>
			<label>progress<input name="progress" value={song?.progress ?? 'Not Started'} /></label>
			<label>sort order<input name="sort_order" type="number" value={song?.sortOrder ?? 0} /></label
			>
			<label class="wide"
				>tab link<input name="tab_link" type="url" value={song?.tabLink ?? ''} /></label
			>
			<label class="wide">notes<textarea name="notes" rows="3">{song?.notes ?? ''}</textarea></label
			>
		</div>
		<div class="form-actions">
			<button type="submit" class="save">{song ? 'save' : 'add song'}</button>
			{#if song}
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
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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
	select,
	textarea {
		font-family: var(--font-family-body);
		font-size: 0.9rem;
		padding: 0.4rem 0.5rem;
		border: 1px solid var(--color-hint);
		border-radius: 4px;
		background: var(--color-background);
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
		display: grid;
		grid-template-columns: 2fr 1.5fr 1fr 1fr auto;
		gap: 1rem;
		align-items: center;
		padding: 0.85rem 1rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
	}

	.title {
		font-weight: 600;
	}

	.artist,
	.difficulty,
	.progress {
		font-size: 0.85rem;
		color: var(--color-text-secondary);
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		justify-self: end;
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

	@media (max-width: 40rem) {
		.row {
			grid-template-columns: 1fr auto;
		}
		.artist,
		.difficulty,
		.progress {
			display: none;
		}
	}
</style>
