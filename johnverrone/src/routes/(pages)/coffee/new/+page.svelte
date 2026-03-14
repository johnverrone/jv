<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import type { ParsedCoffeeBean } from '$lib/coffee/types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();
	let submitting = $state(false);
	let step = $state<'upload' | 'form'>('upload');
	let parsing = $state(false);
	let parseError = $state('');
	let imageFile = $state<File | null>(null);
	let imagePreview = $state('');
	let contextText = $state('');
	let dragOver = $state(false);

	// Pre-populated form values
	let formValues = $state<ParsedCoffeeBean>({});

	function handleFiles(files: FileList | null) {
		if (!files || files.length === 0) return;
		const file = files[0];
		if (!file.type.startsWith('image/')) return;
		if (imagePreview) URL.revokeObjectURL(imagePreview);
		imageFile = file;
		imagePreview = URL.createObjectURL(file);
	}

	function handleDrop(e: DragEvent) {
		dragOver = false;
		handleFiles(e.dataTransfer?.files ?? null);
	}

	function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		handleFiles(input.files);
	}

	async function parseImage() {
		if (!imageFile) return;
		parsing = true;
		parseError = '';

		try {
			const fd = new FormData();
			fd.append('image', imageFile);
			fd.append('context', contextText);

			const res = await fetch('/api/coffee/parse', { method: 'POST', body: fd });
			const result = await res.json();

			if (!res.ok) {
				parseError = result.error || 'Failed to parse image';
				return;
			}

			formValues = result.bean;
			step = 'form';
		} catch (err) {
			parseError = 'Network error — please try again';
		} finally {
			parsing = false;
		}
	}

	function skipToManual() {
		formValues = {};
		step = 'form';
	}
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
	{:else if step === 'upload'}
		<p class="step-desc">Upload a photo of the coffee bag and we'll extract the details.</p>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="dropzone"
			class:dragover={dragOver}
			class:has-image={!!imagePreview}
			ondragover={(e) => { e.preventDefault(); dragOver = true; }}
			ondragleave={() => (dragOver = false)}
			ondrop={(e) => { e.preventDefault(); handleDrop(e); }}
		>
			{#if imagePreview}
				<img src={imagePreview} alt="Coffee bag preview" class="preview-img" />
				<button type="button" class="change-btn" onclick={() => { imageFile = null; URL.revokeObjectURL(imagePreview); imagePreview = ''; }}>
					Change photo
				</button>
			{:else}
				<div class="dropzone-content">
					<p>Drop a photo here or</p>
					<label class="file-select-btn">
						Choose file
						<input type="file" accept="image/*" capture="environment" onchange={handleFileInput} hidden />
					</label>
				</div>
			{/if}
		</div>

		<label>
			Context <span class="hint">optional — e.g. "paid $18", "gift from a friend"</span>
			<textarea bind:value={contextText} rows="2" placeholder="Any extra details..."></textarea>
		</label>

		{#if parseError}
			<p class="error">{parseError}</p>
		{/if}

		<div class="upload-actions">
			<button type="button" onclick={parseImage} disabled={!imageFile || parsing}>
				{parsing ? 'Parsing...' : 'Parse Photo'}
			</button>
			<button type="button" class="secondary" onclick={skipToManual}>
				Skip to manual entry
			</button>
		</div>
	{:else}
		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}

		<button type="button" class="back-btn" onclick={() => (step = 'upload')}>
			&larr; Back to photo upload
		</button>

		<form
			method="POST"
			enctype="multipart/form-data"
			use:enhance={({ formData }) => {
				submitting = true;
				// If user didn't pick a new image in this form but we have one from step 1, inject it
				const formImage = formData.get('image') as File | null;
				if ((!formImage || formImage.size === 0) && imageFile) {
					formData.set('image', imageFile);
				}
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}
		>

			<label>
				Name
				<input type="text" name="name" required value={formValues.name ?? ''} />
			</label>

			<label>
				Roaster
				<select name="roaster" required>
					<option value="">Select roaster...</option>
					{#each data.roasters as roaster}
						<option value={roaster.slug} selected={formValues.roaster === roaster.slug}>
							{roaster.name}
						</option>
					{/each}
				</select>
			</label>

			<label>
				Rating (1–5)
				<input type="number" name="rating" min="1" max="5" value={formValues.rating ?? ''} />
			</label>

			<label>
				Origins <span class="hint">comma-separated</span>
				<input
					type="text"
					name="origins"
					placeholder="Colombia, Ethiopia"
					value={formValues.origins?.join(', ') ?? ''}
				/>
			</label>

			<label>
				Flavors <span class="hint">comma-separated</span>
				<input
					type="text"
					name="flavors"
					placeholder="chocolate, citrus"
					value={formValues.flavors?.join(', ') ?? ''}
				/>
			</label>

			<label>
				Process
				<input type="text" name="process" placeholder="Washed" value={formValues.process ?? ''} />
			</label>

			<label class="checkbox">
				<input type="checkbox" name="single_origin" checked={formValues.single_origin ?? false} />
				Single Origin
			</label>

			<label class="checkbox">
				<input
					type="checkbox"
					name="currently_brewing"
					checked={formValues.currently_brewing ?? false}
				/>
				Currently Brewing
			</label>

			<label>
				Price (12oz)
				<input
					type="number"
					name="price_12oz"
					step="0.01"
					min="0"
					value={formValues.price_12oz ?? ''}
				/>
			</label>

			<label>
				Notes
				<textarea name="notes" rows="3">{formValues.notes ?? ''}</textarea>
			</label>

			<label>
				Photo
				<input type="file" name="image" accept="image/*" capture="environment" />
			</label>
			{#if imagePreview}
				<p class="hint">Photo from Step 1 will be used if you don't select a new one above.</p>
			{/if}

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

	.step-desc {
		color: #555;
		margin-bottom: 1rem;
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

	button.secondary {
		background: transparent;
		color: #555;
		border: 1px solid #ccc;
	}

	.back-btn {
		background: transparent;
		color: #555;
		padding: 0.5rem 0;
		font-size: 0.85rem;
		font-weight: normal;
		margin-bottom: 0.5rem;
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

	/* Dropzone */
	.dropzone {
		border: 2px dashed #ccc;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		margin-bottom: 1rem;
		transition: border-color 0.15s;
		position: relative;
	}

	.dropzone.dragover {
		border-color: #333;
		background: #f9f9f9;
	}

	.dropzone.has-image {
		padding: 0.5rem;
	}

	.dropzone-content p {
		margin: 0 0 0.75rem;
		color: #888;
	}

	.preview-img {
		max-width: 100%;
		max-height: 300px;
		border-radius: 4px;
		object-fit: contain;
	}

	.change-btn {
		margin-top: 0.5rem;
		padding: 0.35rem 0.75rem;
		font-size: 0.8rem;
		background: #eee;
		color: #333;
	}

	.file-select-btn {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: #333;
		color: white;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.upload-actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
