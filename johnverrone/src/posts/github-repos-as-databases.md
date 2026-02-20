---
title: 'GitHub Repos as Databases'
description: 'In the AI era, a repo full of flat files might be all you need.'
date: '2026-02-19'
categories:
  - tech
  - AI
published: true
---

For a while now I've been noticing a pattern in how I build things. I reach for a database out of habit, set up some ORM, write migrations, configure connection strings — and then realize I'm storing like 40 records that barely ever change. Sound familiar?

With AI tools changing how we interact with data, I think it's worth asking: do you actually need a database? For a surprising number of use cases, a GitHub repo full of flat files might be all you need.

## Structured and unstructured, side by side

One of the underrated benefits of a repo-as-database is that you can mix formats naturally. JSON or YAML for structured data, Markdown for prose, images in a folder. No ORM, no schema migrations. The filesystem _is_ the schema.

Need a list of products? That's a `products.json` file. Need a blog? Markdown files with frontmatter (like this very post). Need config? YAML. You already know how all of this works. There's nothing new to learn.

## Version control is free

This is the one that gets me. Every change to your "database" is automatically tracked, diffable, and reversible. You get audit logs, blame, branching, and rollback — without configuring anything. That's the kind of thing teams spend real money on with traditional databases.

Want to know who changed a record and when? `git blame`. Want to undo a bad change? `git revert`. Want to experiment with a different data shape? Make a branch. This is all stuff you'd have to bolt on to a database, and it's just _there_.

## Agentic operations

This is where it gets really interesting. AI agents already know how to work with files and git. They can read data, write changes, open pull requests, and trigger CI — all with existing tooling. No database drivers, no connection strings, no credentials to manage.

Think of GitHub Actions as triggers, and pull requests as transactions with built-in review gates. An agent can propose a change, CI can validate it, and a human (or another agent) can approve it. That's a pretty solid workflow for a lot of use cases, and you didn't have to build any of it.

## Lightweight APIs

Need to expose your data? You've got options. The GitHub API gives you read access out of the box. You can serve files via a simple REST wrapper, build an MCP server, or just use static hosting for read-heavy use cases.

Compare that to exposing a database: you need an API layer, authentication, rate limiting, connection pooling — the list goes on. For a repo, you can literally just point at the raw file URL and call it a day.

## Where it falls short

I'm not going to pretend this works for everything. It doesn't.

- **High write throughput** — Git is not designed for hundreds of writes per second. If you need that, you need a real database.
- **Concurrent writes** — Merge conflicts are annoying enough in code. They're worse when they're in your data layer.
- **Relational queries** — If you need joins, aggregations, or complex queries, flat files will make your life miserable.
- **Large binary data** — Git doesn't love large files. Git LFS helps, but it's not the same as a proper blob store.
- **Real-time subscriptions** — If you need live updates pushed to clients, a repo is not your friend.

Real databases exist for good reasons. Use them when you need them.

## Don't overcomplicate it

The takeaway here isn't "databases are bad." It's "maybe you don't need one yet." For personal projects, config-driven apps, content sites, and agentic workflows, flat files in a repo are simple, portable, and surprisingly powerful.

The best architecture is the one you don't have to think about. And for a lot of what I build, a repo full of Markdown and JSON is exactly that.
