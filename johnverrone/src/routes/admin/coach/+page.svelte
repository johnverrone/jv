<script lang="ts">
	import { enhance } from '$app/forms';
	import SvelteMarked from 'svelte-marked';
	import { MODALITIES, DAY_NAMES, HABIT_LABELS } from '$lib/coach/types';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const summary = $derived(data.summary);
	const habit = $derived(summary.habit);

	let bareMinFor = $state<number | null>(null);
	let loggingCustom = $state(false);

	const logFor = (sessionId: number) => summary.workouts.find((w) => w.planSessionId === sessionId);

	const metric = (type: string) => summary.todayMetrics.find((m) => m.type === type)?.value;
	const recovery = $derived(metric('whoop_recovery'));

	const HABIT_FIELDS = ['noAddedSugar', 'noAlcohol', 'mobilityDone'] as const;
</script>

<svelte:head>
	<title>today · coach · command center</title>
</svelte:head>

<div class="head">
	<h1>{DAY_NAMES[summary.dayOfWeek]} <span class="date">{summary.date}</span></h1>
	<span class="adherence">week {summary.weekAdherence.done}/{summary.weekAdherence.planned}</span>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}

{#if recovery !== undefined || metric('whoop_strain') !== undefined}
	<div class="whoop-strip">
		{#if recovery !== undefined}
			<span class="chip" class:red={recovery < 34} class:yellow={recovery >= 34 && recovery < 67}>
				recovery {recovery}%
			</span>
		{/if}
		{#if metric('whoop_strain') !== undefined}<span class="chip"
				>strain {metric('whoop_strain')}</span
			>{/if}
		{#if metric('resting_hr') !== undefined}<span class="chip">rhr {metric('resting_hr')}</span
			>{/if}
		{#if metric('hrv_ms') !== undefined}<span class="chip">hrv {metric('hrv_ms')}ms</span>{/if}
		{#if metric('sleep_perf') !== undefined}<span class="chip">sleep {metric('sleep_perf')}%</span
			>{/if}
		{#if recovery !== undefined && recovery < 34}
			<span class="chip-note">red day — the bare minimum counts</span>
		{/if}
	</div>
{/if}

{#if summary.latestCheckIn}
	<section class="coach-msg">
		<header>
			<span class="author">{summary.latestCheckIn.author}</span>
			<span class="msg-meta">{summary.latestCheckIn.type} · {summary.latestCheckIn.date}</span>
		</header>
		<SvelteMarked source={summary.latestCheckIn.content} />
	</section>
{/if}

{#each summary.sessions as session (session.id)}
	{@const logged = logFor(session.id)}
	<section class="session" class:done={logged?.status === 'done'}>
		<header class="session-head">
			<h2>{session.name}</h2>
			<span class="meta">
				{session.modality}
				{#if session.durationMin}· {session.durationMin}′{/if}
			</span>
		</header>

		{#if logged}
			<p class="logged">
				{logged.status}{logged.variant === 'bare_min' ? ' (bare minimum)' : ''}
				{#if logged.durationMin}· {logged.durationMin}′{/if}
				{#if logged.rpe}· RPE {logged.rpe}{/if}
			</p>
			<form method="POST" action="?/undoWorkout" use:enhance>
				<input type="hidden" name="id" value={logged.id} />
				<button type="submit" class="link">undo</button>
			</form>
		{:else}
			{#if bareMinFor === session.id && session.bareMin}
				<div class="rx bare">
					<SvelteMarked source={session.bareMin} />
				</div>
			{:else if session.prescription}
				<div class="rx">
					<SvelteMarked source={session.prescription} />
				</div>
			{/if}

			{#if session.bareMin}
				<button
					type="button"
					class="link"
					onclick={() => (bareMinFor = bareMinFor === session.id ? null : session.id)}
				>
					{bareMinFor === session.id
						? 'back to the full session'
						: `chaotic day? bare minimum (${session.bareMinDurationMin ?? 15}′)`}
				</button>
			{/if}

			<div class="actions">
				<form method="POST" action="?/logDone" use:enhance>
					<input type="hidden" name="plan_session_id" value={session.id} />
					<input
						type="hidden"
						name="variant"
						value={bareMinFor === session.id ? 'bare_min' : 'full'}
					/>
					<button type="submit" class="big done-btn">
						done{bareMinFor === session.id ? ' (bare min)' : ''}
					</button>
				</form>
				<form method="POST" action="?/logSkipped" use:enhance>
					<input type="hidden" name="plan_session_id" value={session.id} />
					<button type="submit" class="big skip-btn">skip</button>
				</form>
			</div>
		{/if}
	</section>
{:else}
	<section class="session">
		<p class="empty">
			Nothing planned for {DAY_NAMES[summary.dayOfWeek]} —
			<a href="/admin/coach/plan">set up the weekly plan</a>.
		</p>
	</section>
{/each}

<section class="custom">
	<button type="button" class="link" onclick={() => (loggingCustom = !loggingCustom)}>
		{loggingCustom ? 'cancel' : 'did something else? log it'}
	</button>
	{#if loggingCustom}
		<form
			method="POST"
			action="?/logCustom"
			class="custom-form"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					loggingCustom = false;
				};
			}}
		>
			<div class="grid">
				<label>
					what
					<select name="modality" required>
						{#each MODALITIES.filter((m) => m !== 'rest') as m (m)}
							<option value={m}>{m}</option>
						{/each}
					</select>
				</label>
				<label>minutes<input name="duration_min" type="number" min="1" /></label>
				<label>rpe (1-10)<input name="rpe" type="number" min="1" max="10" /></label>
				<label class="wide">notes<input name="notes" /></label>
			</div>
			<button type="submit" class="save">log it</button>
		</form>
	{/if}
</section>

<section class="habits">
	<h2>today's habits</h2>
	<div class="habit-row">
		{#each HABIT_FIELDS as field (field)}
			{@const on = habit?.[field] ?? false}
			{@const streak = summary.streaks[field]}
			<form method="POST" action="?/toggleHabit" use:enhance>
				<input type="hidden" name="field" value={field} />
				<button type="submit" class="habit" class:on>
					<span class="habit-name">{HABIT_LABELS[field]}</span>
					<span class="habit-state">{on ? '✓' : '—'}</span>
					<span class="habit-streak">{streak.current}d · best {streak.best}</span>
				</button>
			</form>
		{/each}
	</div>
</section>

<style>
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.date,
	.adherence {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.whoop-strip {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 1rem;
	}

	.chip {
		font-family: var(--font-family-mono);
		font-size: 0.7rem;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		border: 1px solid #27ae60;
		color: var(--color-text-secondary);
	}

	.chip.yellow {
		border-color: #f39c12;
	}

	.chip.red {
		border-color: #c0392b;
	}

	.chip-note {
		font-family: var(--font-family-mono);
		font-size: 0.7rem;
		color: #c0392b;
	}

	.coach-msg {
		padding: 1rem 1.25rem;
		background: var(--color-background-secondary);
		border-left: 3px solid var(--color-accent);
		border-radius: var(--border-radius);
		margin-bottom: 1.5rem;
	}

	.coach-msg header {
		display: flex;
		gap: 0.75rem;
		align-items: baseline;
		margin-bottom: 0.25rem;
	}

	.author {
		font-family: var(--font-family-mono);
		font-weight: 600;
		font-size: 0.8rem;
	}

	.msg-meta {
		font-family: var(--font-family-mono);
		font-size: 0.7rem;
		color: var(--color-text-secondary);
	}

	.session {
		padding: 1.25rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
		margin-bottom: 1rem;
	}

	.session.done {
		border-left: 3px solid #27ae60;
	}

	.session-head {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
	}

	h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	.meta {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.rx {
		margin: 0.75rem 0;
		font-size: 0.9rem;
	}

	.rx.bare {
		padding: 0.5rem 0.75rem;
		border: 1px dashed var(--color-hint);
		border-radius: var(--border-radius);
	}

	.logged {
		font-family: var(--font-family-mono);
		font-size: 0.9rem;
		margin: 0.75rem 0 0.25rem;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.big {
		flex: 1;
		min-height: 48px;
		font-family: var(--font-family-mono);
		font-size: 0.95rem;
		border: none;
		border-radius: var(--border-radius);
		cursor: pointer;
	}

	.done-btn {
		background: var(--color-card-bg);
		color: var(--color-card-fg);
	}

	.skip-btn {
		flex: 0 1 30%;
		background: none;
		border: 1px solid var(--color-hint);
		color: var(--color-text-secondary);
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

	.custom {
		margin-bottom: 1.5rem;
	}

	.custom-form {
		margin-top: 0.75rem;
		padding: 1rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
	}

	.grid {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-family: var(--font-family-mono);
		font-size: 0.7rem;
		color: var(--color-text-secondary);
	}

	.wide {
		grid-column: 1 / -1;
	}

	input,
	select {
		font-family: var(--font-family-body);
		font-size: 0.9rem;
		padding: 0.4rem 0.5rem;
		border: 1px solid var(--color-hint);
		border-radius: 4px;
		background: var(--color-background);
	}

	.save {
		margin-top: 0.75rem;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		padding: 0.4rem 0.75rem;
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		border: none;
		border-radius: var(--border-radius);
		cursor: pointer;
	}

	.habits h2 {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		margin-bottom: 0.5rem;
	}

	.habit-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}

	.habit-row form {
		display: contents;
	}

	.habit {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.75rem 0.25rem;
		min-height: 72px;
		border: 1px solid var(--color-hint);
		border-radius: var(--border-radius);
		background: none;
		cursor: pointer;
		font-family: var(--font-family-mono);
	}

	.habit.on {
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		border-color: var(--color-card-bg);
	}

	.habit-name {
		font-size: 0.7rem;
	}

	.habit-state {
		font-size: 1.1rem;
	}

	.habit-streak {
		font-size: 0.65rem;
		opacity: 0.7;
	}

	.empty {
		font-family: var(--font-family-mono);
		font-size: 0.85rem;
		color: var(--color-text-secondary);
	}

	.error {
		color: #c0392b;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
	}

	@media (max-width: 30rem) {
		.habit-row {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
