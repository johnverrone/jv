-- OAuth tokens for pull-based integrations (Strava, Whoop) — one row per
-- provider, single athlete. Both providers ROTATE refresh tokens: every
-- refresh response carries a new refresh_token that must be persisted, and the
-- old one is invalidated (a stale refresh token means reconnecting by hand).

CREATE TABLE oauth_token (
  provider       TEXT PRIMARY KEY,                -- strava|whoop
  access_token   TEXT NOT NULL,
  refresh_token  TEXT NOT NULL,
  expires_at     INTEGER NOT NULL,                -- unix seconds
  athlete_id     TEXT,                            -- provider-side user id
  scopes         TEXT,
  last_synced_at TEXT,                            -- bookkeeping for the sync page
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
