<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let syncing = $state<string | null>(null);
</script>

<svelte:head>
	<title>sync · coach · command center</title>
</svelte:head>

<div class="head">
	<h1>integrations</h1>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}

<section class="provider">
	<header>
		<h2>strava</h2>
		<span class="status" class:on={data.strava.connected}>
			{data.strava.connected ? 'connected' : 'not connected'}
		</span>
	</header>
	<p class="desc">
		Pulls recent activities (Apple Watch runs, Karoo rides) and matches them to planned sessions.
		Already-logged days are skipped.
	</p>
	{#if !data.configured.strava}
		<p class="hint">
			Set <code>STRAVA_CLIENT_ID</code> / <code>STRAVA_CLIENT_SECRET</code> first (strava.com/settings/api;
			callback domain must include this host).
		</p>
	{:else if !data.strava.connected}
		<a class="save" href="/auth/strava">connect strava</a>
	{:else}
		<div class="row">
			<form
				method="POST"
				action="?/syncStrava"
				use:enhance={() => {
					syncing = 'strava';
					return async ({ update }) => {
						await update();
						syncing = null;
					};
				}}
			>
				<input type="hidden" name="days" value="14" />
				<button type="submit" class="save" disabled={syncing === 'strava'}>
					{syncing === 'strava' ? 'syncing…' : 'sync last 14 days'}
				</button>
			</form>
			<form method="POST" action="?/disconnect" use:enhance>
				<input type="hidden" name="provider" value="strava" />
				<button type="submit" class="link danger">disconnect</button>
			</form>
		</div>
		<p class="meta">
			{#if data.strava.athleteId}athlete {data.strava.athleteId} ·{/if}
			last sync: {data.strava.lastSyncedAt ?? 'never'}
		</p>
		{#if form && 'strava' in form && form.strava}
			<p class="result">
				imported {form.strava.imported} · duplicates skipped {form.strava.duplicates}
				{#if form.strava.replaced}
					· replaced {form.strava.replaced} whoop {form.strava.replaced === 1 ? 'log' : 'logs'}
				{/if}
				{#if form.strava.unmapped.length}
					· unmapped types: {form.strava.unmapped.join(', ')}
				{/if}
			</p>
		{/if}
	{/if}
</section>

<section class="provider">
	<header>
		<h2>whoop</h2>
		<span class="status" class:on={data.whoop.connected}>
			{data.whoop.connected ? 'connected' : 'not connected'}
		</span>
	</header>
	<p class="desc">
		Pulls recovery, strain, resting HR, HRV, and sleep performance into metrics, plus Whoop-logged
		workouts (lifts, walks) into the log. Strava wins when both saw a workout. The public API
		doesn't expose the Stress Monitor score.
	</p>
	{#if !data.configured.whoop}
		<p class="hint">
			Set <code>WHOOP_CLIENT_ID</code> / <code>WHOOP_CLIENT_SECRET</code> first
			(developer.whoop.com; register the <code>/auth/whoop/callback</code> redirect URI).
		</p>
	{:else if !data.whoop.connected}
		<a class="save" href="/auth/whoop">connect whoop</a>
	{:else}
		<div class="row">
			<form
				method="POST"
				action="?/syncWhoop"
				use:enhance={() => {
					syncing = 'whoop';
					return async ({ update }) => {
						await update();
						syncing = null;
					};
				}}
			>
				<input type="hidden" name="days" value="14" />
				<button type="submit" class="save" disabled={syncing === 'whoop'}>
					{syncing === 'whoop' ? 'syncing…' : 'sync last 14 days'}
				</button>
			</form>
			<form method="POST" action="?/disconnect" use:enhance>
				<input type="hidden" name="provider" value="whoop" />
				<button type="submit" class="link danger">disconnect</button>
			</form>
		</div>
		<p class="meta">last sync: {data.whoop.lastSyncedAt ?? 'never'}</p>
		{#if form && 'whoop' in form && form.whoop}
			<p class="result">
				{form.whoop.metrics} readings across {form.whoop.days} days · workouts imported
				{form.whoop.workouts.imported} · duplicates skipped {form.whoop.workouts.duplicates}
				{#if form.whoop.workouts.unmapped.length}
					· unmapped: {form.whoop.workouts.unmapped.join(', ')}
				{/if}
			</p>
		{/if}
	{/if}
</section>

<style>
	.head {
		margin-bottom: 1rem;
	}

	.provider {
		padding: 1.25rem;
		background: var(--color-background-secondary);
		border-radius: var(--border-radius);
		margin-bottom: 1rem;
	}

	.provider header {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
	}

	h2 {
		margin: 0;
		font-size: 1.05rem;
	}

	.status {
		font-family: var(--font-family-mono);
		font-size: 0.7rem;
		padding: 0.1rem 0.5rem;
		border-radius: 999px;
		border: 1px solid var(--color-hint);
		color: var(--color-text-secondary);
	}

	.status.on {
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		border-color: var(--color-card-bg);
	}

	.desc {
		font-size: 0.85rem;
		color: var(--color-text-secondary);
		margin: 0.5rem 0 0.75rem;
	}

	.hint {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}

	.row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.save {
		display: inline-block;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		padding: 0.45rem 0.9rem;
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		border: none;
		border-radius: var(--border-radius);
		cursor: pointer;
		text-decoration: none;
	}

	.save:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.link {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
	}

	.link.danger {
		color: #c0392b;
	}

	.meta {
		font-family: var(--font-family-mono);
		font-size: 0.7rem;
		color: var(--color-text-secondary);
		margin: 0.5rem 0 0;
	}

	.result {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: #27ae60;
		margin: 0.5rem 0 0;
	}

	.error {
		color: #c0392b;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
	}

	code {
		font-family: var(--font-family-mono);
		font-size: 0.9em;
	}
</style>
