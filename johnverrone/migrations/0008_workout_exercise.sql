-- Per-exercise detail for a logged workout. Duration and strain say nothing
-- about load, so "has my squat gone up?" was unanswerable from workout_log
-- alone. Rows hang off a workout_log row and are filled in after the fact —
-- Whoop's sync creates the workout, the detail arrives later via the API.
--
-- One row per exercise *entry*: normally the working/top set ("3x5 @ 185"),
-- but nothing stops a second row with the same name for a back-off set. The
-- history query picks the heaviest row per date, so both shapes work.
--
-- `slug` is the normalized name (lowercase, non-alphanumerics collapsed to _)
-- so "Back Squat", "back squat", and "back-squat" are one exercise when
-- pulling progression. It's derived on write — never supplied by a client.

CREATE TABLE workout_exercise (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_log_id INTEGER NOT NULL REFERENCES workout_log(id) ON DELETE CASCADE,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  name           TEXT NOT NULL,                     -- as typed: "Back Squat"
  slug           TEXT NOT NULL,                     -- derived: "back_squat"
  sets           INTEGER,                           -- sets at this load
  reps           INTEGER,                           -- reps per set
  weight_lb      REAL,                              -- NULL for bodyweight work
  rpe            INTEGER,                           -- 1-10
  notes          TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_exercise_workout ON workout_exercise(workout_log_id, sort_order);
CREATE INDEX idx_exercise_slug ON workout_exercise(slug);
