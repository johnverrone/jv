<script lang="ts">
	import type { PageData } from './$types';
	import { PortableText } from '@portabletext/svelte';

	let { data }: { data: PageData } = $props();
</script>

<h1>{data.post.title}</h1>
<PortableText value={data.post.body} components={{}} />
