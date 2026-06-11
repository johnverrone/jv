-- Publish / "ready for the spotlight" gate. Orthogonal to `status`: `status` is the
-- item's physical lifecycle (active|stored|sold|retired), `visibility` is whether the
-- public site shows it. A sold guitar can still be published; a new item stays draft
-- until promoted. New items default to 'draft' (curation is a deliberate gesture).
ALTER TABLE gear_item ADD COLUMN visibility   TEXT NOT NULL DEFAULT 'draft'; -- draft|published
ALTER TABLE gear_item ADD COLUMN published_at TEXT;                          -- ISO timestamp, set on first publish
ALTER TABLE gear_item ADD COLUMN featured     INTEGER NOT NULL DEFAULT 0;    -- 0|1, homepage spotlight

CREATE INDEX idx_gear_visibility ON gear_item(visibility);
