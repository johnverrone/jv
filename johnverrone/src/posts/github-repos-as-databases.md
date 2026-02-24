---
title: 'GitHub Repos as Databases'
description: 'Sometimes a folder full of JSON is all you need.'
date: '2026-02-19'
categories:
  - tech
  - AI
published: true
---

For a while now I've been noticing a pattern in how I build things. I reach for a database (well, I spend a long time researching the best database), set up some ORM, feel overwhelmed about migrations and connection strings and indexes and eventually burn out and stop working on the project. All that to look back and realize I'm storing like 40 records that barely ever change. Sound familiar?

With AI tools changing how we interact with data, I've been asking myself: what if I didn't do all that? Do I actually need a database? For a surprising number of use cases, a GitHub repo full of flat files might be all you need.

## Structured and unstructured, side by side

One of the underrated benefits of a repo-as-database is that you can mix formats naturally. JSON or YAML for structured data, Markdown for AI context, images in a folder. No ORM, no schema migrations. The filesystem _is_ the schema.

Need a list of products? That's a `products.json` file. Need a blog? Markdown files with frontmatter (like this very post). Need config? YAML. You already know how all of this works. There's nothing new to learn.

## Version control is free

This is the part that sold me. Especially with AI agents in the mix. Every change to your "database" is automatically tracked, diffable, and reversible with git. All that annoying stuff I hated about setting up a database just comes for free.

Want to know who changed a record and when? `git blame`. Want to undo a bad change? `git revert`. Want to experiment with a different data shape? Make a branch. This is all stuff you'd have to bolt on to a database, and it's just _there_.

## Agentic operations

This is the part that actually got me thinking about all of this in the first place. AI agents are _really_ good at working with files and git. They can read your data, make changes, open PRs, kick off CI — and none of that requires database drivers or connection strings or any of that setup. It just works with the tools that already exist.

Think about it: GitHub Actions are basically triggers, and PRs are transactions with a built-in review step. An agent proposes a change, CI checks it, you (or another agent) approve it. That's a legit workflow and you didn't have to build any of it yourself.

## Lightweight APIs

Need to expose your data? You've got options. The GitHub API gives you read access out of the box. You can serve files via a simple REST wrapper, build an MCP server, or just use static hosting for read-heavy use cases.

Compare that to exposing a real database where you need auth, rate limiting, connection pooling, an API layer... it's a whole thing. With a repo you can literally just point at the raw file URL. Done.

## Where it falls short

I'm not going to pretend this works for everything. It doesn't.

- **High write throughput** — Git is not designed for hundreds of writes per second. If you need that, you need a real database.
- **Concurrent writes** — Merge conflicts are annoying enough in code. They're worse when they're in your data layer.
- **Relational / complex queries** — If you need joins, aggregations, or complex queries, flat files will make your life miserable.
- **Large binary data** — Git doesn't love large files. Git LFS helps, but it's not the same as a proper blob store.
- **Real-time stuff** — If you need live updates pushed to clients, a repo is not your friend.

Real databases exist for good reasons. Use them when you need them.

## Don't overcomplicate it

The takeaway here isn't "databases are bad." It's "maybe you don't need one yet." For personal projects, config-driven apps, content sites, and agentic workflows, flat files in a repo are simple, portable, and surprisingly powerful.

The best architecture is the one you don't have to think about. And for a lot of what I build, a repo full of Markdown and JSON is exactly that.
