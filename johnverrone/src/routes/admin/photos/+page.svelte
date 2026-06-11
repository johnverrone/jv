<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { mediaUrl } from '$lib/media';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let uploading = $state(false);
	let uploadError = $state('');

	const looksHeic = (file: File) =>
		/image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);

	// HEIC is decoded to JPEG in the browser (libheif-wasm) so the server/R2/
	// Cloudflare never has to handle HEIC. Then POST to the upload action.
	async function handleFiles(files: FileList) {
		uploadError = '';
		uploading = true;
		try {
			for (const file of Array.from(files)) {
				let blob: Blob = file;
				let name = file.name;
				if (looksHeic(file)) {
					const { heicTo } = await import('heic-to');
					blob = await heicTo({ blob: file, type: 'image/jpeg', quality: 0.9 });
					name = name.replace(/\.[^.]+$/, '') + '.jpg';
				}
				const fd = new FormData();
				fd.append('photo', blob, name);
				const res = await fetch('?/upload', { method: 'POST', body: fd });
				if (!res.ok) throw new Error(`upload failed (${res.status})`);
			}
			await invalidateAll();
		} catch (e) {
			uploadError = e instanceof Error ? e.message : String(e);
		} finally {
			uploading = false;
		}
	}
</script>

<svelte:head><title>photos · command center</title></svelte:head>

<a class="back" href="/admin">← command center</a>

<div class="head">
	<h1>photos</h1>
	<label class="add" class:busy={uploading}>
		<input
			type="file"
			accept="image/*,.heic,.heif"
			multiple
			disabled={uploading}
			onchange={(e) => {
				const files = e.currentTarget.files;
				if (files?.length) handleFiles(files);
				e.currentTarget.value = '';
			}}
		/>
		{uploading ? 'uploading…' : '+ add photos'}
	</label>
</div>

{#if uploadError}<p class="error">{uploadError}</p>{/if}

{#if data.keys.length === 0}
	<p class="empty">No photos yet. Add some above.</p>
{:else}
	<ul class="grid">
		{#each data.keys as key (key)}
			<li>
				<img src={mediaUrl('photos', key, { width: 300 })} alt="" loading="lazy" />
				<form
					method="POST"
					action="?/delete"
					use:enhance={({ cancel }) => {
						if (!confirm('Delete this photo?')) cancel();
						return async ({ update }) => update();
					}}
				>
					<input type="hidden" name="key" value={key} />
					<button type="submit" class="del" aria-label="delete photo">×</button>
				</form>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.back {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		text-decoration: none;
	}

	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.add {
		font-family: var(--font-family-mono);
		font-size: 0.8rem;
		padding: 0.4rem 0.75rem;
		border: 1px solid var(--color-background-secondary);
		border-radius: var(--border-radius);
		cursor: pointer;
	}
	.add input {
		display: none;
	}
	.add.busy {
		opacity: 0.6;
		cursor: progress;
	}

	.grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 8px;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	}

	.grid li {
		position: relative;
	}

	.grid img {
		width: 100%;
		aspect-ratio: 3/4;
		object-fit: cover;
		border-radius: var(--border-radius);
		display: block;
		background: var(--color-background-secondary);
	}

	.del {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 1.6rem;
		height: 1.6rem;
		border: none;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.55);
		color: #fff;
		font-size: 1rem;
		line-height: 1;
		cursor: pointer;
	}
	.del:hover {
		background: #c0392b;
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
