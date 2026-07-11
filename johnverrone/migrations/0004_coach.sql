-- Health coach: weekly plan template, workout + habit logs, body metrics, and
-- coach check-in messages. All `date` columns are LOCAL America/Chicago days
-- stored as ISO yyyy-mm-dd TEXT, computed server-side (src/lib/server/date.ts).
-- day_of_week is 0=Sunday..6=Saturday to match JS Date#getDay; Monday-first
-- ordering is a display concern only.

CREATE TABLE plan_session (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  day_of_week           INTEGER NOT NULL,              -- 0=Sunday..6=Saturday
  sort_order            INTEGER NOT NULL DEFAULT 0,    -- allows >1 session per day
  name                  TEXT NOT NULL,                 -- "Strength A"
  modality              TEXT NOT NULL,                 -- lift|run|bike|hiit|hike|mobility|rest
  duration_min          INTEGER,                       -- target duration; NULL for rest
  prescription          TEXT,                          -- markdown: the full session
  bare_min              TEXT,                          -- markdown: 10-15 min fallback for chaotic days
  bare_min_duration_min INTEGER,
  active                INTEGER NOT NULL DEFAULT 1,    -- soft-disable without losing log refs
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_plan_dow ON plan_session(day_of_week, sort_order);

CREATE TABLE workout_log (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  date               TEXT NOT NULL,                    -- local yyyy-mm-dd
  plan_session_id    INTEGER REFERENCES plan_session(id) ON DELETE SET NULL,
  status             TEXT NOT NULL,                    -- done|skipped|modified
  variant            TEXT NOT NULL DEFAULT 'full',     -- full|bare_min
  modality           TEXT NOT NULL,                    -- what was actually performed
  duration_min       INTEGER,
  rpe                INTEGER,                          -- 1-10
  notes              TEXT,
  source             TEXT NOT NULL DEFAULT 'manual',   -- manual|api|strava
  strava_activity_id TEXT UNIQUE,                      -- phase 2: webhook dedupe key
  created_at         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_workout_date ON workout_log(date);

-- One row per day; habit toggles are upserted onto it. Streaks reward explicit
-- logging, so everything defaults to 0/not-done.
CREATE TABLE habit_log (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  date           TEXT NOT NULL UNIQUE,
  no_added_sugar INTEGER NOT NULL DEFAULT 0,           -- 0|1
  no_alcohol     INTEGER NOT NULL DEFAULT 0,           -- 0|1
  mobility_done  INTEGER NOT NULL DEFAULT 0,           -- 0|1
  notes          TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Sparse time series: weight_lb, a1c, resting_hr, ... (open set).
CREATE TABLE body_metric (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  date       TEXT NOT NULL,
  type       TEXT NOT NULL,
  value      REAL NOT NULL,
  notes      TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(date, type)                                   -- one reading per metric per day
);

CREATE INDEX idx_metric_type_date ON body_metric(type, date);

-- Coaching messages (written by scheduled agents through /api/coach/checkin,
-- or by hand). Surfaced on the Today page.
CREATE TABLE check_in (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  date       TEXT NOT NULL,
  type       TEXT NOT NULL,                            -- daily|weekly
  author     TEXT NOT NULL DEFAULT 'coach',            -- coach|john
  content    TEXT NOT NULL,                            -- markdown
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_checkin_date ON check_in(date, type);
