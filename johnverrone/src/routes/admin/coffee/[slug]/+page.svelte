<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { mediaUrl } from '$lib/media';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const bean = $derived(data.bean);

	let uploading = $state(false);
	let uploadError = $state('');

	const looksHeic = (f: File) => /image\/hei[cf]/i.test(f.type) || /\.hei[cf]$/i.test(f.name);
	const dollars = (cents: number | null) => (cents == null ? '' : (cents / 100).toFixed(2));

	async function onPick(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		uploading = true;
		uploadError = '';
		try {
			let blob: Blob = file;
			let name = file.name;
			if (looksHeic(file)) {
				const { heicTo } = await import('heic-to');
				blob = await heicTo({ blob: file, type: 'image/jpeg', quality: 0.9 });
				name = name.replace(/\.[^.]+$/, '') + '.jpg';
			}
			const fd = new FormData();
			fd.append('id', String(bean.id));
			fd.append('image', blob, name);
			const res = await fetch('?/uploadImage', { method: 'POST', body: fd });
			if (!res.ok) throw new Error(`upload failed (${res.status})`);
			await invalidateAll();
		} catch (err) {
			uploadError = err instanceof Error ? err.message : String(err);
		} finally {
			uploading = false;
		}
	}
</script>

<svelte:head><title>{bean.name} · coffee</title></svelte:head>

<a class="back" href="/admin/coffee">← coffee</a>

<div class="header">
	<div class="photo">
		{#if bean.imageKey}
			<img src={mediaUrl('coffee', bean.imageKey, { width: 300 })} alt={bean.name} />
		{:else}
			<div class="noimg">no image</div>
		{/if}
		<label class="add" class:busy={uploading}>
			<input type="file" accept="image/*,.heic,.heif" disabled={uploading} onchange={onPick} />
			{uploading ? 'uploading…' : bean.imageKey ? 'replace image' : '+ add image'}
		</label>
		{#if uploadError}<p class="error">{uploadError}</p>{/if}
	</div>

	<div class="title">
		<h1>{bean.name}</h1>
		<form
			method="POST"
			action={bean.visibility === 'published' ? '?/unpublish' : '?/publish'}
			use:enhance
		>
			<input type="hidden" name="id" value={bean.id} />
			<button type="submit" class="vis" class:on={bean.visibility === 'published'}>
				{bean.visibility === 'published' ? '★ published' : '☆ publish'}
			</button>
		</form>
	</div>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}

<form method="POST" action="?/update" class="edit" use:enhance>
	<input type="hidden" name="id" value={bean.id} />
	<div class="grid">
		<label>name<input name="name" value={bean.name} required /></label>
		<label>roaster
			<select name="roaster" required>
				{#each data.roasters as r (r.slug)}
					<option value={r.slug} selected={r.slug === bean.roasterSlug}>{r.name}</option>
				{/each}
			</select>
		</label>
		<label>rating<input name="rating" type="number" min="1" max="5" value={bean.rating ?? ''} /></label>
		<label>price 12oz ($)<input name="price_12oz" type="number" step="0.01" min="0" value={dollars(bean.price12ozCents)} /></label>
		<label>origins<input name="origins" value={bean.origins.join(', ')} /></label>
		<label>flavors<input name="flavors" value={bean.flavors.join(', ')} /></label>
		<label>process<input name="process" value={bean.process ?? ''} /></label>
		<label class="check"><input name="single_origin" type="checkbox" checked={bean.singleOrigin} /> single origin</label>
		<label class="check"><input name="currently_brewing" type="checkbox" checked={bean.currentlyBrewing} /> currently brewing</label>
		<label class="wide">notes<textarea name="notes" rows="3">{bean.notes ?? ''}</textarea></label>
	</div>
	<button type="submit" class="save">save</button>
</form>

<form
	method="POST"
	action="?/deleteBean"
	class="danger"
	use:enhance={({ cancel }) => {
		if (!confirm(`Delete ${bean.name}?`)) cancel();
		return async ({ update }) => update();
	}}
>
	<input type="hidden" name="id" value={bean.id} />
	<button type="submit">delete bean</button>
</form>

<style>
	.back {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		text-decoration: none;
	}
	.header {
		display: flex;
		gap: 1.5rem;
		margin: 1rem 0 2rem;
		flex-wrap: wrap;
	}
	.photo {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 180px;
	}
	.photo img,
	.noimg {
		width: 180px;
		height: 180px;
		object-fit: cover;
		border-radius: var(--border-radius);
		background: var(--color-background-secondary);
	}
	.noimg {
		display: grid;
		place-items: center;
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}
	.add {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		text-align: center;
		padding: 0.35rem 0.5rem;
		border: 1px solid var(--color-hint);
		border-radius: 4px;
		cursor: pointer;
	}
	.add input {
		display: none;
	}
	.add.busy {
		opacity: 0.6;
		cursor: progress;
	}
	.title {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	h1 {
		margin: 0;
	}
	.vis {
		align-self: flex-start;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		padding: 0.3rem 0.6rem;
		border: 1px solid var(--color-hint);
		border-radius: 4px;
		background: var(--color-background);
		cursor: pointer;
	}
	.vis.on {
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		border-color: transparent;
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
		gap: 0.4rem;
	}
	.wide {
		grid-column: 1 / -1;
	}
	input,
	textarea,
	select {
		font-family: var(--font-family-body);
		font-size: 0.9rem;
		padding: 0.4rem 0.5rem;
		border: 1px solid var(--color-hint);
		border-radius: 4px;
		background: var(--color-background);
	}
	.save {
		margin-top: 1rem;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		padding: 0.4rem 0.75rem;
		background: var(--color-card-bg);
		color: var(--color-card-fg);
		border: none;
		border-radius: var(--border-radius);
		cursor: pointer;
	}
	.danger {
		margin-top: 2.5rem;
	}
	.danger button {
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		padding: 0.35rem 0.7rem;
		background: none;
		border: 1px solid #c0392b;
		color: #c0392b;
		border-radius: var(--border-radius);
		cursor: pointer;
	}
	.error {
		color: #c0392b;
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		margin: 0.25rem 0;
	}
</style>
