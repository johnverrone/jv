# Subtext setup report

## Result: already installed — no changes made

The Subtext capture snippet is already installed at `src/app.html:11` (the inline
`<script>` spanning lines 11–32 of the SvelteKit HTML template). It matches the
snippet provided for this install exactly:

- `_fs_org`: `o-24GGAZ-na1` (same org)
- `_fs_host`: `fullstory.com`
- `_fs_script`: `edge.fullstory.com/s/fs.js`
- `_fs_namespace`: `FS`
- Snippet version `2.0.0`

Placement is correct for SvelteKit: inside `<head>` after `%sveltekit.head%`, so it
loads on every page.

## What was checked

1. `package.json` — no `@fullstory/browser`, `@fullstory/react-native`, or
   `@fullstory/snippet` dependency (the snippet here is the inline script variant,
   which doesn't need one).
2. HTML entry point (`src/app.html`) — genuine snippet found (`_fs_script`
   assignment plus the full bootstrap IIFE), not a false positive like UI copy,
   type declarations, or wrapper utilities.

## Not evaluated (run stops at pre-check)

Because the pre-check found an existing install, these steps were intentionally
skipped: CSP review, user identification (`FS('setIdentity')`), analytics-tool
linkage (`FS('getSession')` URL), and privacy masking (`.fs-mask` / `.fs-exclude`).
If you want those layered onto the existing install, re-run setup asking for those
steps specifically, or request them directly in a Claude session.
