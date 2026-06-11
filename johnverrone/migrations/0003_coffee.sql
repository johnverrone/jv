-- Coffee beans + roasters, migrated off the GitHub-repo YAML into D1. Images move
-- to the johnverrone-coffee R2 bucket (image_key), not GitHub. visibility defaults
-- to 'published' so the migrated set keeps the current all-public behavior.

CREATE TABLE coffee_roaster (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  location   TEXT,
  website    TEXT,
  notes      TEXT,
  image_key  TEXT,                                -- R2 key in the coffee bucket
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE coffee_bean (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  slug              TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  roaster_slug      TEXT NOT NULL REFERENCES coffee_roaster(slug),
  rating            INTEGER,                       -- 1-5
  origins           TEXT NOT NULL DEFAULT '[]',    -- JSON array of strings
  flavors           TEXT NOT NULL DEFAULT '[]',    -- JSON array of strings
  process           TEXT,
  single_origin     INTEGER NOT NULL DEFAULT 0,    -- 0|1
  currently_brewing INTEGER NOT NULL DEFAULT 0,    -- 0|1
  price_12oz_cents  INTEGER,                        -- money as integer cents
  notes             TEXT,
  image_key         TEXT,                           -- R2 key in the coffee bucket
  visibility        TEXT NOT NULL DEFAULT 'published', -- draft|published
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_bean_roaster ON coffee_bean(roaster_slug);
CREATE INDEX idx_bean_visibility ON coffee_bean(visibility);
