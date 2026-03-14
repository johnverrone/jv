<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();
	let submitting = $state(false);
</script>

<div class="container">
	<h1>Add Coffee Bean</h1>

	{#if !data.authenticated}
		<a href="/auth/github" class="login-btn">Sign in with GitHub</a>
	{:else if form?.success}
		<div class="success">
			<p>PR created!</p>
			<a href={form.prUrl} target="_blank" rel="noopener">View Pull Request</a>
			<a href="/coffee/new">Add another</a>
		</div>
	{:else}
		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}

		<form
			method="POST"
			enctype="multipart/form-data"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}
		>
			<label>
				Name
				<input type="text" name="name" required />
			</label>

			<label>
				Roaster
				<select name="roaster" required>
					<option value="">Select roaster...</option>
					{#each data.roasters as roaster}
						<option value={roaster.slug}>{roaster.name}</option>
					{/each}
				</select>
			</label>

			<label>
				Rating (1–5)
				<input type="number" name="rating" min="1" max="5" />
			</label>

			<label>
				Origins <span class="hint">comma-separated</span>
				<input type="text" name="origins" placeholder="Colombia, Ethiopia" />
			</label>

			<label>
				Flavors <span class="hint">comma-separated</span>
				<input type="text" name="flavors" placeholder="chocolate, citrus" />
			</label>

			<label>
				Process
				<input type="text" name="process" placeholder="Washed" />
			</label>

			<label class="checkbox">
				<input type="checkbox" name="single_origin" />
				Single Origin
			</label>

			<label class="checkbox">
				<input type="checkbox" name="currently_brewing" />
				Currently Brewing
			</label>

			<label>
				Price (12oz)
				<input type="number" name="price_12oz" step="0.01" min="0" />
			</label>

			<label>
				Notes
				<textarea name="notes" rows="3"></textarea>
			</label>

			<label>
				Photo
				<input type="file" name="image" accept="image/*" capture="environment" />
			</label>

			<button type="submit" disabled={submitting}>
				{submitting ? 'Submitting...' : 'Create PR'}
			</button>
		</form>

		<a href="/auth/logout" class="logout">Sign out</a>
	{/if}
</div>

<style>
	.container {
		max-width: 500px;
		margin: 0 auto;
		padding: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-weight: 600;
	}

	label.checkbox {
		flex-direction: row-reverse;
		justify-content: flex-end;
		align-items: center;
		gap: 0.5rem;
		font-weight: normal;
	}

	input[type='text'],
	input[type='number'],
	select,
	textarea {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	.hint {
		font-weight: normal;
		font-size: 0.75rem;
		color: #888;
	}

	button {
		padding: 0.75rem;
		border: none;
		border-radius: 4px;
		background: #333;
		color: white;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.login-btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: #24292e;
		color: white;
		border-radius: 4px;
		text-decoration: none;
		font-weight: 600;
	}

	.success {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.error {
		color: #c00;
		margin-bottom: 0.5rem;
	}

	.logout {
		display: block;
		margin-top: 2rem;
		font-size: 0.8rem;
		color: #888;
	}
</style>
