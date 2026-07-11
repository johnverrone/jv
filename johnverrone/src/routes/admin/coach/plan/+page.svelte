<script lang="ts">
	import { enhance } from '$app/forms';
	import { MODALITIES, DAY_ORDER, DAY_NAMES } from '$lib/coach/types';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let editingId = $state<number | null>(null);
	let adding = $state(false);

	const sessionsForDay = (dow: number) => data.sessions.filter((s) => s.dayOfWeek === dow);
</script>

<svelte:head>
	<title>plan · coach · command center</title>
</svelte:head>

<div class="head">
	<h1>weekly plan</h1>
	<button class="toggle" onclick={() => (adding = !adding)}>
		{adding ? 'cancel' : '+ add session'}
	</button>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}

{#if data.sessions.length === 0}
	<form method="POST" action="?/seed" use:enhance class="seed">
		<p>No plan yet. Start from the default hybrid week (edit anything after).</p>
		<button type="submit" class="save">seed default plan</button>
	</form>
{/if}

{#if adding}
	{@render sessionForm(null)}
{/if}

{#each DAY_ORDER as dow (dow)}
	<section>
		<h2>{DAY_NAMES[dow]}</h2>
		{#each sessionsForDay(dow) as session (session.id)}
			{#if editingId === session.id}
				{@render sessionForm(session)}
			{:else}
				<article class="session" class:inactive={!session.active}>
					<div class="row">
						<span class="name">{session.name}</span>
						<span class="modality">{session.modality}</span>
						{#if session.durationMin}<span class="dur">{session.durationMin}′</span>{/if}
						{#if !session.active}<span class="badge">inactive</span>{/if}
						<span class="actions">
							<button class="link" onclick={() => (editingId = session.id)}>edit</button>
							<form method="POST" action="?/delete" use:enhance class="inline">
								<input type="hidden" name="id" value={session.id} />
								<button class="link danger" type="submit">delete</button>
							</form>
						</span>
					</div>
					{#if session.prescription}<pre class="rx">{session.prescription}</pre>{/if}
					{#if session.bareMin}
						<p class="bare">
							bare minimum{session.bareMinDurationMin ? ` (${session.bareMinDurationMin}′)` : ''}:
							{session.bareMin}
						</p>
					{/if}
				</article>
			{/if}
		{:else}
			<p class="empty">nothing planned</p>
		{/each}
	</section>
{/each}

{#snippet sessionForm(session: (typeof data.sessions)[number] | null)}
	<form
		method="POST"
		action={session ? '?/update' : '?/create'}
		class="edit-form"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				editingId = null;
				adding = false;
			};
		}}
	>
		{#if session}<input type="hidden" name="id" value={session.id} />{/if}
		<div class="grid">
			<label>
				name<input name="name" required value={session?.name ?? ''} />
			</label>
			<label>
				day
				<select name="day_of_week" required value={String(session?.dayOfWeek ?? 1)}>
					{#each DAY_ORDER as dow (dow)}
						<option value={String(dow)}>{DAY_NAMES[dow]}</option>
					{/each}
				</select>
			</label>
			<label>
				modality
				<select name="modality" required value={session?.modality ?? 'lift'}>
					{#each MODALITIES as m (m)}
						<option value={m}>{m}</option>
					{/each}
				</select>
			</label>
			<label>
				duration (min)<input
					name="duration_min"
					type="number"
					min="1"
					value={session?.durationMin ?? ''}
				/>
			</label>
			<label class="wide">
				prescription (markdown)<textarea name="prescription" rows="5"
					>{session?.prescription ?? ''}</textarea
				>
			</label>
			<label class="wide">
				bare minimum<textarea name="bare_min" rows="2">{session?.bareMin ?? ''}</textarea>
			</label>
			<label>
				bare min duration<input
					name="bare_min_duration_min"
					type="number"
					min="1"
					value={session?.bareMinDurationMin ?? ''}
				/>
			</label>
			<label class="check">
				<input type="checkbox" name="active" checked={session?.active ?? true} /> active
			</label>
		</div>
		<div class="form-actions">
			<button type="submit" class="save">{session ? 'save' : 'add session'}</button>
			{#if session}
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
		margin-bottom: 1rem;
	}

	h2 {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		text-transform: lowercase;
		color: var(--color-text-secondary);
		margin: 1.5rem 0 0.5rem;
	}

	.session {
		padding: 0.85rem 1rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
		margin-bottom: 0.5rem;
	}

	.session.inactive {
		opacity: 0.55;
	}

	.row {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.name {
		font-weight: 600;
	}

	.modality,
	.dur,
	.badge {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}

	.badge {
		border: 1px solid var(--color-hint);
		border-radius: 999px;
		padding: 0.05rem 0.5rem;
	}

	.actions {
		margin-left: auto;
		display: flex;
		gap: 0.75rem;
		align-items: baseline;
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

	.rx {
		font-family: var(--font-family-body);
		font-size: 0.85rem;
		white-space: pre-wrap;
		margin: 0.5rem 0 0;
		color: var(--color-text-primary);
	}

	.bare {
		margin: 0.5rem 0 0;
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.empty {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.seed {
		padding: 1.25rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
		margin-bottom: 1.5rem;
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

	label.check {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
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

	.error {
		color: #c0392b;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
	}
</style>
