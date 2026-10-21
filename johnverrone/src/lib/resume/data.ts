export interface Role {
	title: string;
	start: string;
	end: string;
	focus?: string;
	bullets: string[];
}

export interface Job {
	company: string;
	url?: string;
	location: string;
	start: string;
	end: string;
	roles: Role[];
}

export interface Project {
	name: string;
	url?: string;
	description: string;
}

export interface Resume {
	name: string;
	headline: string;
	location: string;
	links: { label: string; href: string }[];
	summary: string[];
	experience: Job[];
	projects: Project[];
	skills: { group: string; items: string[] }[];
	education: { school: string; degree: string; year: string };
}

export const resume: Resume = {
	name: 'John Verrone',
	headline: 'Senior Software Engineer II at Fullstory',
	location: 'Remote (based in Denver, CO)',
	links: [
		{ label: 'john.verrone@gmail.com', href: 'mailto:john.verrone@gmail.com' },
		{ label: 'github.com/johnverrone', href: 'https://github.com/johnverrone' },
		{ label: 'linkedin.com/in/johnverrone', href: 'https://www.linkedin.com/in/johnverrone' },
		{ label: 'johnverrone.com', href: 'https://johnverrone.com' }
	],
	summary: [
		'I build products, and lately that means using the newest AI tools to make applications, developer tools, and agents that solve real problems. Engineering is my specialty, but I also design, talk with customers, and help decide what to build next.',
		"In more than ten years at Fullstory and The Home Depot, I've taken products from zero to one and supported them long after launch. Getting new things off the ground is what I enjoy most.",
		"I'm looking for a staff-level builder role or an opportunity to manage a team."
	],
	experience: [
		{
			company: 'Fullstory',
			url: 'https://www.fullstory.com',
			location: 'Atlanta, GA, then remote',
			start: 'Jan 2020',
			end: 'Present',
			roles: [
				{
					title: 'Senior Software Engineer II',
					start: 'Feb 2025',
					end: 'Present',
					focus: 'Tech lead, Fullstory Workforce (team of 3). Workflow Intelligence, MCP, agents.',
					bullets: [
						'Built core parts of Workflow Intelligence, which went GA in July 2026, including page property extraction in the event pipeline, the workflow metrics APIs, and the D3 charts. Redesigned the aggregate metrics calculation to keep customer-facing numbers accurate.',
						'Launched the Workforce MCP server in June 2026, then moved the Fullstory Analytics MCP tools into it so customers only set up one connection. Designed v2 around higher-level workflow tools after prototyping how agents work with raw event data.',
						'Turned a hack-day LLM report agent into a production feature in two weeks, building in tenant isolation, XSS protection, report caching to cut token spend, and evals.',
						'Built a workflow analyst agent for StoryAI, our in-app AI assistant. Prototyped generative UI for it with Google ADK and A2UI, so the agent streams back interactive workflow charts instead of text.',
						'Wrote design docs for cross-app process adherence, workflow correlation, and a global app catalog. Represented engineering in weekly product and design meetings and in customer feedback sessions.',
						'Mentored a newer engineer into owning major features, ran sprint planning and retros, and led a SEV3 incident response.'
					]
				},
				{
					title: 'Senior Software Engineer',
					start: 'Aug 2022',
					end: 'Feb 2025',
					focus: 'Wayfinder, Metric Alerts, Grammar',
					bullets: [
						'One of two founding engineers on Wayfinder, a new product for tracking SaaS usage and Shadow IT that launched in 2025 as Fullstory Workforce. Worked in React, Go, Postgres, Solr, and a Chrome extension, and joined customer calls through our first sale.',
						'Shipped a self-service app catalog, audit log, user onboarding, the public Chrome Web Store extension, and our EU deployment. Replaced Redux with TanStack Query.',
						'Built the Metric Alerts UI (50+ PRs) and set up sprint planning for the team, after which we hit our alpha milestones on time.',
						'Finished the Grammar migration and deleted the legacy components and feature flags. Made time zones consistent across our charts and shipped dark mode.'
					]
				},
				{
					title: 'Software Engineer',
					start: 'Jan 2020',
					end: 'Aug 2022',
					focus: 'App Frameworks, Conversions',
					bullets: [
						"Led the move to Grammar, Fullstory's new design system. Wrote the migration plan in 2020 and built a theme engine that switched the whole app between old and new styles with one flag, without feature teams changing their code.",
						'Ran the Home & Search style audit before GA, which turned 156 design notes into 46 tickets shipped over three iterations.',
						'Rolled out ESLint across 37 frontend packages and set up code owners for 38. Later added Prettier and accessibility linting.',
						'Helped move the entire app from Tomato, our homegrown framework, to React. Converted and managed the rollout of core areas like settings, billing, and navigation.',
						'Owned the dimensions feature in Conversions as a new hire. Took regular shifts as Launch Coordinator for weekly production deploys and wrote the hotfix process docs.'
					]
				}
			]
		},
		{
			company: 'The Home Depot',
			url: 'https://www.homedepot.com',
			location: 'Atlanta, GA',
			start: '2015',
			end: '2019',
			roles: [
				{
					title: 'Senior Software Engineer',
					start: '2017',
					end: '2019',
					focus: 'OrangeWorks innovation lab, Supply Chain',
					bullets: [
						'Prototyped AR/VR, computer vision, and IoT ideas for stores. Rebuilt a supply chain network app with Kotlin and GraphQL on GCP.'
					]
				},
				{
					title: 'Software Engineer',
					start: '2015',
					end: '2017',
					focus: 'Merchandising, Supply Chain. Started as an intern in 2015.',
					bullets: [
						'Built a company-wide product information API on Kafka, Cassandra, and Spark. Worked with Pivotal Labs to merge two catalogs.'
					]
				}
			]
		}
	],
	projects: [
		{
			name: 'Command Center MCP',
			url: 'https://github.com/johnverrone/jv/tree/main/command-center-mcp',
			description:
				'Remote MCP server on Cloudflare Workers with GitHub OAuth that tracks my training, guitar practice, and coffee. Uses MCP Apps to render interactive views right in the chat, like a weekly training plan and a song list whose buttons call back into the server.'
		},
		{
			name: 'KinMind (in progress)',
			description:
				"An AI second brain for families. Caregivers tell it things in plain chat, like an allergy, a practice schedule, or a parent's next appointment, and ask for them back later. Built with Next.js, Supabase, and the Vercel AI SDK, sending simple requests to Claude Haiku and harder ones to Sonnet."
		}
	],
	skills: [
		{ group: 'Building with AI', items: ['Claude Code', 'pi', 'agent workflows'] },
		{
			group: 'AI in products',
			items: ['LLM agents', 'MCP servers', 'MCP Apps', 'generative UI (A2UI)', 'evals']
		},
		{
			group: 'Frontend',
			items: ['TypeScript', 'React', 'D3', 'TanStack Query', 'Chrome extensions']
		},
		{
			group: 'Backend & infra',
			items: ['Go', 'gRPC', 'Postgres / AlloyDB', 'Spanner', 'Solr', 'GCP', 'Kubernetes']
		}
	],
	education: {
		school: 'Georgia Institute of Technology',
		degree: 'B.S. Computer Science',
		year: '2016'
	}
};
