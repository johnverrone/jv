-- Gear tracker + maintenance. Private, dynamic data stored in D1 (not git-backed).
PRAGMA foreign_keys = ON;

CREATE TABLE gear_item (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  slug                 TEXT NOT NULL UNIQUE,
  name                 TEXT NOT NULL,
  category             TEXT NOT NULL,
  manufacturer         TEXT,
  model                TEXT,
  serial_number        TEXT,
  acquired_date        TEXT,                       -- ISO yyyy-mm-dd
  acquired_price_cents INTEGER,                    -- money as integer cents
  status               TEXT NOT NULL DEFAULT 'active', -- active|stored|sold|retired
  notes                TEXT,
  image_url            TEXT,
  created_at           TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at           TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE maintenance_log (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  gear_item_id   INTEGER NOT NULL REFERENCES gear_item(id) ON DELETE CASCADE,
  performed_date TEXT NOT NULL,
  type           TEXT NOT NULL,                    -- service|repair|cleaning|string-change|...
  description    TEXT,
  cost_cents     INTEGER,
  performed_by   TEXT,                             -- 'self' or shop name
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_maint_gear ON maintenance_log(gear_item_id, performed_date);
