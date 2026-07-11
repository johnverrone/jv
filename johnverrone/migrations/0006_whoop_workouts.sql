-- Whoop-logged workouts (weightlifting, walks) import into workout_log next to
-- Strava activities. UNIQUE index dedupes re-syncs; SQLite can't add an inline
-- UNIQUE via ALTER TABLE. Cross-provider dedupe is by date+modality with
-- Strava taking priority (a Strava import replaces a whoop-sourced row).

ALTER TABLE workout_log ADD COLUMN whoop_workout_id TEXT;

CREATE UNIQUE INDEX idx_workout_whoop_id ON workout_log(whoop_workout_id);
