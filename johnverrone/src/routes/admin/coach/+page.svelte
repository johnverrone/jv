<script lang="ts">
	import { enhance } from '$app/forms';
	import SvelteMarked from 'svelte-marked';
	import { MODALITIES, DAY_NAMES, DAY_ORDER, HABIT_LABELS } from '$lib/coach/types';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const summary = $derived(data.summary);
	const habit = $derived(summary.habit);

	let bareMinFor = $state<number | null>(null);
	let loggingCustom = $state(false);
	let editingPlan = $state(false);
	let editingId = $state<number | null>(null);
	let adding = $state(false);

	const logFor = (sessionId: number) => summary.workouts.find((w) => w.planSessionId === sessionId);

	const metric = (type: string) => summary.todayMetrics.find((m) => m.type === type)?.value;
	const recovery = $derived(metric('whoop_recovery'));

	const HABIT_FIELDS = ['noAddedSugar', 'noAlcohol', 'mobilityDone'] as const;

	const statusGlyph = (status: string, variant: string) => {
		if (status === 'done') return variant === 'bare_min' ? '✓ bare min' : '✓ done';
		if (status === 'modified') return '~ modified';
		return '✗ skipped';
	};

	const planForDay = (dow: number) => data.planSessions.filter((s) => s.dayOfWeek === dow);
</script>

<svelte:head>
	<title>coach · command center</title>
</svelte:head>

<div class="head">
	<h1>week of {data.week.weekStart}</h1>
	<span class="adherence">{data.week.done}/{data.week.planned} · {data.week.pct}%</span>
</div>

<nav class="subnav">
	<a href="?start={data.prevStart}">← prev</a>
	<a href="/admin/coach" class:muted={data.currentWeek}>this week</a>
	<a href="?start={data.nextStart}">next →</a>
	<button type="button" class="link edit-toggle" onclick={() => (editingPlan = !editingPlan)}>
		{editingPlan ? 'done editing' : 'edit plan'}
	</button>
</nav>

{#if form?.error}<p class="error">{form.error}</p>{/if}

{#if editingPlan}
	{#if data.planSessions.length === 0}
		<form method="POST" action="?/seed" use:enhance class="seed">
			<p>No plan yet. Start from the default hybrid week (edit anything after).</p>
			<button type="submit" class="save">seed default plan</button>
		</form>
	{/if}

	{#if adding}
		{@render sessionForm(null)}
	{:else}
		<button type="button" class="toggle add" onclick={() => (adding = true)}>+ add session</button>
	{/if}

	{#each DAY_ORDER as dow (dow)}
		<section class="edit-day">
			<h2>{DAY_NAMES[dow]}</h2>
			{#each planForDay(dow) as session (session.id)}
				{#if editingId === session.id}
					{@render sessionForm(session)}
				{:else}
					<article class="plan-session" class:inactive={!session.active}>
						<div class="row">
							<span class="name">{session.name}</span>
							<span class="meta">{session.modality}</span>
							{#if session.durationMin}<span class="meta">{session.durationMin}′</span>{/if}
							{#if !session.active}<span class="badge">inactive</span>{/if}
							<span class="row-actions">
								<button class="link" onclick={() => (editingId = session.id)}>edit</button>
								<form method="POST" action="?/delete" use:enhance class="inline">
									<input type="hidden" name="id" value={session.id} />
									<button class="link danger" type="submit">delete</button>
								</form>
							</span>
						</div>
						{#if session.prescription}<pre class="plan-rx">{session.prescription}</pre>{/if}
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
{:else}
	{#if data.currentWeek}
		{#if recovery !== undefined || metric('whoop_strain') !== undefined}
			<div class="whoop-strip">
				{#if recovery !== undefined}
					<span
						class="chip"
						class:red={recovery < 34}
						class:yellow={recovery >= 34 && recovery < 67}
					>
						recovery {recovery}%
					</span>
				{/if}
				{#if metric('whoop_strain') !== undefined}<span class="chip"
						>strain {metric('whoop_strain')}</span
					>{/if}
				{#if metric('resting_hr') !== undefined}<span class="chip">rhr {metric('resting_hr')}</span
					>{/if}
				{#if metric('hrv_ms') !== undefined}<span class="chip">hrv {metric('hrv_ms')}ms</span>{/if}
				{#if metric('sleep_perf') !== undefined}<span class="chip"
						>sleep {metric('sleep_perf')}%</span
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
	{/if}

	<ul class="days">
		{#each data.week.days as day (day.date)}
			{@const isToday = data.currentWeek && day.date === summary.date}
			{#if isToday}
				<li class="today-cell">
					<div class="day-head">
						<span class="day-name">{DAY_NAMES[day.dayOfWeek]}</span>
						<span class="day-date">{day.date} · today</span>
					</div>
					<div class="today-body">
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
										<div class="rx bare-rx">
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
									<button type="button" class="link" onclick={() => (editingPlan = true)}>
										edit the weekly plan
									</button>.
								</p>
							</section>
						{/each}
						{#each summary.workouts.filter((w) => !summary.sessions.some((s) => s.id === w.planSessionId)) as log (log.id)}
							<p class="extra-log">
								{log.modality} (unplanned) · {statusGlyph(log.status, log.variant)}
							</p>
						{/each}
					</div>
				</li>
			{:else}
				<li class:future={day.date > summary.date}>
					<div class="day-head">
						<span class="day-name">{DAY_NAMES[day.dayOfWeek]}</span>
						<span class="day-date">{day.date}</span>
					</div>
					<div class="day-body">
						{#each day.sessions as session (session.id)}
							{@const log = day.logs.find((l) => l.planSessionId === session.id)}
							<div class="planned">
								<span class="name">{session.name}</span>
								{#if log}
									<span class="glyph" class:ok={log.status !== 'skipped'}>
										{statusGlyph(log.status, log.variant)}
									</span>
								{:else if day.date < summary.date && session.modality !== 'rest'}
									<span class="glyph missed">missed</span>
								{:else if day.date > summary.date && session.modality !== 'rest'}
									<span class="glyph">up next</span>
								{/if}
							</div>
						{/each}
						{#each day.logs.filter((l) => !day.sessions.some((s) => s.id === l.planSessionId)) as log (log.id)}
							<div class="planned extra">
								<span class="name">{log.modality} (unplanned)</span>
								<span class="glyph ok">{statusGlyph(log.status, log.variant)}</span>
							</div>
						{/each}
					</div>
				</li>
			{/if}
		{/each}
	</ul>

	{#if data.currentWeek}
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
	{/if}
{/if}

{#snippet sessionForm(session: (typeof data.planSessions)[number] | null)}
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
			<button
				type="button"
				class="toggle"
				onclick={() => {
					editingId = null;
					adding = false;
				}}>cancel</button
			>
		</div>
	</form>
{/snippet}

<style>
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.adherence {
		font-family: var(--font-family-mono);
		font-size: 0.85rem;
		color: var(--color-text-secondary);
	}

	.subnav {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		margin-bottom: 1.25rem;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
	}

	.subnav a {
		color: var(--color-accent);
		text-decoration: none;
	}

	.subnav a.muted {
		color: var(--color-text-secondary);
	}

	.edit-toggle {
		margin-left: auto;
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

	/* --- week board --- */

	.days {
		list-style: none;
		margin: 0 0 1.5rem;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.days li {
		display: grid;
		grid-template-columns: 8rem 1fr;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
	}

	.days li.future {
		opacity: 0.6;
	}

	.days li.today-cell {
		grid-template-columns: 1fr;
		gap: 0.5rem;
		background: none;
		padding: 0;
		outline: 2px solid var(--color-accent);
		outline-offset: 4px;
		border-radius: var(--border-radius);
		margin: 4px 0;
	}

	.today-cell .day-head {
		padding: 0.5rem 1rem 0;
	}

	.day-name {
		font-weight: 600;
		display: block;
	}

	.day-date {
		font-family: var(--font-family-mono);
		font-size: 0.7rem;
		color: var(--color-text-secondary);
	}

	.planned {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		font-size: 0.9rem;
	}

	.planned.extra .name {
		color: var(--color-text-secondary);
	}

	.glyph {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}

	.glyph.ok {
		color: #27ae60;
	}

	.glyph.missed {
		color: #c0392b;
	}

	.extra-log {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		margin: 0;
		padding: 0 1rem 0.5rem;
	}

	/* --- today's expanded card --- */

	.session {
		padding: 1.25rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
	}

	.today-body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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

	.rx.bare-rx {
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

	.link.danger {
		color: #c0392b;
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

	.save {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		padding: 0.4rem 0.75rem;
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		border: none;
		border-radius: var(--border-radius);
		cursor: pointer;
	}

	.custom-form .save {
		margin-top: 0.75rem;
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

	/* --- plan editing --- */

	.edit-day h2 {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		text-transform: lowercase;
		color: var(--color-text-secondary);
		margin: 1.5rem 0 0.5rem;
	}

	.plan-session {
		padding: 0.85rem 1rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
		margin-bottom: 0.5rem;
	}

	.plan-session.inactive {
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

	.badge {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		border: 1px solid var(--color-hint);
		border-radius: 999px;
		padding: 0.05rem 0.5rem;
	}

	.row-actions {
		margin-left: auto;
		display: flex;
		gap: 0.75rem;
		align-items: baseline;
	}

	.inline {
		display: inline;
	}

	.plan-rx {
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

	.edit-form .grid {
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}

	.form-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.toggle {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		padding: 0.4rem 0.75rem;
		border: 1px solid var(--color-background-secondary);
		border-radius: var(--border-radius);
		background: none;
		cursor: pointer;
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
		.days li {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}
	}
</style>
