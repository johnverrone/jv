<script lang="ts">
	import { resume } from '$lib/resume/data';

	const description = resume.summary[0];

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: resume.name,
		jobTitle: resume.experience[0].roles[0].title,
		worksFor: { '@type': 'Organization', name: resume.experience[0].company },
		alumniOf: { '@type': 'CollegeOrUniversity', name: resume.education.school },
		url: 'https://johnverrone.com/resume',
		sameAs: resume.links.filter((l) => l.href.startsWith('https')).map((l) => l.href)
	});

	const jsonLdTag = `<script type="application/ld+json">${jsonLd}<` + '/script>';

	const dates = (start: string, end: string) => (start === end ? start : `${start} – ${end}`);
</script>

<svelte:head>
	<title>{resume.name} | Resume</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={`${resume.name} | Resume`} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="profile" />
	<meta property="og:url" content="https://johnverrone.com/resume" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static JSON-LD built from our own data, no user input -->
	{@html jsonLdTag}
</svelte:head>

<nav class="back no-print"><a href="/">← johnverrone</a></nav>

<main class="resume">
	<header class="intro">
		<h1>{resume.name}</h1>
		<p class="headline">{resume.headline}</p>
		<p class="location">{resume.location}</p>
		<ul class="links">
			{#each resume.links as link (link.href)}
				<li><a href={link.href}>{link.label}</a></li>
			{/each}
		</ul>
	</header>

	<section class="summary" aria-label="Summary">
		{#each resume.summary as paragraph, i (i)}
			<p>{paragraph}</p>
		{/each}
	</section>

	<section aria-labelledby="experience">
		<h2 id="experience">Experience</h2>
		{#each resume.experience as job, jobIndex (job.company)}
			<article class="job">
				<header class="job-header">
					<div class="row">
						<h3>
							{#if job.url}<a href={job.url}>{job.company}</a>{:else}{job.company}{/if}
						</h3>
						<span class="meta">{dates(job.start, job.end)}</span>
					</div>
					<p class="meta">{job.location}</p>
				</header>
				<ol class="roles">
					{#each job.roles as role, roleIndex (role.title)}
						<li class="role" class:current={jobIndex === 0 && roleIndex === 0}>
							<div class="row">
								<h4>{role.title}</h4>
								<span class="meta">{dates(role.start, role.end)}</span>
							</div>
							{#if role.focus}<p class="meta">{role.focus}</p>{/if}
							{#if role.bullets.length}
								<ul class="bullets">
									{#each role.bullets as bullet, i (i)}
										<li>{bullet}</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				</ol>
			</article>
		{/each}
	</section>

	<section class="projects" aria-labelledby="projects">
		<h2 id="projects">Projects</h2>
		{#each resume.projects as project (project.name)}
			<article class="project">
				<h3>
					{#if project.url}<a href={project.url}>{project.name}</a>{:else}{project.name}{/if}
				</h3>
				<p>{project.description}</p>
			</article>
		{/each}
	</section>

	<div class="columns">
		<section aria-labelledby="skills">
			<h2 id="skills">Skills</h2>
			<dl class="skills">
				{#each resume.skills as skill (skill.group)}
					<dt>{skill.group}</dt>
					<dd>{skill.items.join(', ')}</dd>
				{/each}
			</dl>
		</section>

		<section aria-labelledby="education">
			<h2 id="education">Education</h2>
			<p>{resume.education.degree}</p>
			<p class="meta">{resume.education.school}, {resume.education.year}</p>
		</section>
	</div>
</main>

<style>
	.back,
	.resume {
		--color-muted: #5f5f5f;
		--color-rule: #e4e1d8;
		--color-link-underline: color-mix(in srgb, var(--color-accent) 60%, transparent);
		--timeline-gutter: 1.25rem;

		max-width: 40rem;
		margin: 0 auto;
	}

	.back {
		padding: 1.5rem 1.5rem 0;
		font-size: 0.875rem;

		a {
			color: var(--color-muted);
			text-decoration: none;
		}

		a:hover {
			color: var(--color-accent);
		}
	}

	.resume {
		padding: 2rem 1.5rem 4rem;
		line-height: 1.55;
	}

	a {
		color: inherit;
		text-decoration-color: var(--color-link-underline);
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}

	a:hover {
		color: var(--color-accent);
		text-decoration-color: currentColor;
	}

	h1 {
		font-size: 2rem;
		letter-spacing: -0.01em;
	}

	.headline {
		margin-top: 0.25rem;
		font-size: 1.0625rem;
	}

	.location {
		color: var(--color-muted);
	}

	.links {
		list-style: none;
		padding: 0;
		margin: 0.75rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1.25rem;
		font-size: 0.875rem;
	}

	.summary {
		margin-top: 2rem;

		p + p {
			margin-top: 0.75rem;
		}
	}

	h2 {
		margin-top: 2.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--color-rule);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-accent);
	}

	h3 {
		font-size: 1.25rem;
		font-weight: 700;

		a {
			text-decoration: none;
		}
	}

	h4 {
		font-family: var(--font-family-body);
		font-size: 1rem;
		font-weight: 600;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0 1rem;
	}

	.meta {
		color: var(--color-muted);
		font-size: 0.875rem;
	}

	.row .meta {
		white-space: nowrap;
	}

	.job {
		margin-top: 1.25rem;
	}

	.job + .job {
		margin-top: 2rem;
	}

	.roles {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
	}

	.role {
		position: relative;
		padding: 0 0 1.5rem var(--timeline-gutter);
	}

	.role:last-child {
		padding-bottom: 0;
	}

	.role::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.5rem;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--color-rule);
		box-shadow: 0 0 0 2px var(--color-background);
	}

	.role.current::before {
		background: var(--color-accent);
	}

	.role:not(:last-child)::after {
		content: '';
		position: absolute;
		left: calc(0.25rem - 0.5px);
		top: 1.25rem;
		bottom: 0.25rem;
		width: 1px;
		background: var(--color-rule);
	}

	.bullets {
		list-style-type: disc;
		margin: 0.5rem 0 0;
		padding-left: 0.875rem;

		li + li {
			margin-top: 0.5rem;
		}

		li::marker {
			color: var(--color-muted);
		}
	}

	.project {
		margin-top: 1rem;

		h3 {
			font-size: 1rem;
		}

		h3 a {
			text-decoration: underline;
			text-decoration-color: var(--color-link-underline);
		}

		p {
			margin-top: 0.25rem;
		}
	}

	.columns {
		display: grid;
		gap: 0 3rem;
	}

	@media screen and (min-width: 36rem) {
		.columns {
			grid-template-columns: 2fr 1fr;
			gap: 0 2rem;
		}
	}

	.skills {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0.375rem 1rem;
		margin: 0;

		dt {
			font-weight: 600;
			font-size: 0.875rem;
			line-height: 1.75;
		}

		dd {
			margin: 0;
		}
	}

	@media print {
		@page {
			size: letter;
			margin: 0.35in 0.5in;
		}

		.projects {
			break-inside: avoid;
		}

		.project {
			margin-top: 0.4rem;
		}

		.project h3 {
			font-size: 9.5pt;
		}

		.project p {
			margin-top: 0.1rem;
		}

		.no-print {
			display: none;
		}

		.resume {
			max-width: none;
			padding: 0;
			font-size: 8.75pt;
			line-height: 1.26;
		}

		.intro {
			display: grid;
			grid-template-columns: 1fr auto;
			column-gap: 2rem;
		}

		.intro > :not(.links) {
			grid-column: 1;
		}

		.links {
			grid-column: 2;
			grid-row: 1 / span 3;
			flex-direction: column;
			align-items: flex-end;
			align-self: end;
			gap: 0;
			margin: 0;
			font-size: 8.5pt;
		}

		.location {
			font-size: 9pt;
		}

		.skills dt {
			font-size: 8.5pt;
		}

		h1 {
			font-size: 18pt;
		}

		.headline {
			font-size: 10pt;
		}

		.summary {
			margin-top: 0.6rem;
		}

		.summary p + p {
			margin-top: 0.2rem;
		}

		h2 {
			letter-spacing: 0;
			margin-top: 0.6rem;
			padding-top: 0.3rem;
		}

		h3 {
			font-size: 11.5pt;
		}

		h4 {
			font-size: 9.5pt;
		}

		.meta {
			font-size: 8.5pt;
		}

		.job {
			margin-top: 0.4rem;
		}

		.job + .job {
			margin-top: 0.7rem;
		}

		.roles {
			margin-top: 0.35rem;
		}

		.role {
			padding-bottom: 0.4rem;
			break-inside: avoid;
		}

		.role::before {
			top: 0.3rem;
		}

		.role:not(:last-child)::after {
			top: 0.9rem;
		}

		.bullets {
			margin-top: 0.2rem;
			padding-left: 0.75rem;
		}

		.bullets li + li {
			margin-top: 0.15rem;
		}

		.columns {
			grid-template-columns: 2fr 1fr;
			gap: 0 2rem;
		}

		.skills {
			gap: 0 0.75rem;
		}

		.skills dt {
			line-height: inherit;
		}

		a {
			text-decoration: none;
		}
	}
</style>
