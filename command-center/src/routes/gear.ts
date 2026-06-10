import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
  HOBBIES_WRITE_TOKEN?: string;
};

const UPDATABLE_FIELDS = [
  "name",
  "category",
  "manufacturer",
  "model",
  "serial_number",
  "acquired_date",
  "acquired_price_cents",
  "status",
  "notes",
  "image_url",
] as const;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const gear = new Hono<{ Bindings: Bindings }>();

// List gear items, optionally filtered by status.
gear.get("/gear", async (c) => {
  const status = c.req.query("status");
  const stmt = status
    ? c.env.DB.prepare(
        "SELECT * FROM gear_item WHERE status = ? ORDER BY name"
      ).bind(status)
    : c.env.DB.prepare("SELECT * FROM gear_item ORDER BY name");
  const { results } = await stmt.all();
  return c.json({ items: results });
});

// Single gear item with its maintenance history.
gear.get("/gear/:slug", async (c) => {
  const slug = c.req.param("slug");
  const item = await c.env.DB.prepare(
    "SELECT * FROM gear_item WHERE slug = ?"
  )
    .bind(slug)
    .first();
  if (!item) return c.json({ error: "Not found" }, 404);

  const { results: maintenance } = await c.env.DB.prepare(
    "SELECT * FROM maintenance_log WHERE gear_item_id = ? ORDER BY performed_date DESC, id DESC"
  )
    .bind(item.id)
    .all();

  return c.json({ item, maintenance });
});

// Create a gear item.
gear.post("/gear", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body?.name || !body?.category) {
    return c.json({ error: "name and category are required" }, 400);
  }
  const slug: string = body.slug ? slugify(body.slug) : slugify(body.name);

  try {
    const result = await c.env.DB.prepare(
      `INSERT INTO gear_item
         (slug, name, category, manufacturer, model, serial_number,
          acquired_date, acquired_price_cents, status, notes, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        slug,
        body.name,
        body.category,
        body.manufacturer ?? null,
        body.model ?? null,
        body.serial_number ?? null,
        body.acquired_date ?? null,
        body.acquired_price_cents ?? null,
        body.status ?? "active",
        body.notes ?? null,
        body.image_url ?? null
      )
      .run();

    const item = await c.env.DB.prepare(
      "SELECT * FROM gear_item WHERE id = ?"
    )
      .bind(result.meta.last_row_id)
      .first();
    return c.json({ item }, 201);
  } catch (e) {
    const message = String(e);
    if (message.includes("UNIQUE")) {
      return c.json({ error: `slug "${slug}" already exists` }, 409);
    }
    throw e;
  }
});

// Partial update of a gear item (only provided fields change).
gear.put("/gear/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "invalid body" }, 400);

  const sets: string[] = [];
  const values: unknown[] = [];
  for (const field of UPDATABLE_FIELDS) {
    if (field in body) {
      sets.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  if (sets.length > 0) {
    sets.push("updated_at = datetime('now')");
    values.push(id);
    await c.env.DB.prepare(
      `UPDATE gear_item SET ${sets.join(", ")} WHERE id = ?`
    )
      .bind(...values)
      .run();
  }

  const item = await c.env.DB.prepare("SELECT * FROM gear_item WHERE id = ?")
    .bind(id)
    .first();
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json({ item });
});

// Delete a gear item and its maintenance logs (explicit, not relying on cascade).
gear.delete("/gear/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM maintenance_log WHERE gear_item_id = ?").bind(id),
    c.env.DB.prepare("DELETE FROM gear_item WHERE id = ?").bind(id),
  ]);
  return c.body(null, 204);
});

// Add a maintenance log entry to a gear item.
gear.post("/gear/:id/maintenance", async (c) => {
  const gearItemId = Number(c.req.param("id"));
  const body = await c.req.json().catch(() => null);
  if (!body?.performed_date || !body?.type) {
    return c.json({ error: "performed_date and type are required" }, 400);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO maintenance_log
       (gear_item_id, performed_date, type, description, cost_cents, performed_by)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      gearItemId,
      body.performed_date,
      body.type,
      body.description ?? null,
      body.cost_cents ?? null,
      body.performed_by ?? null
    )
    .run();

  const maintenance = await c.env.DB.prepare(
    "SELECT * FROM maintenance_log WHERE id = ?"
  )
    .bind(result.meta.last_row_id)
    .first();
  return c.json({ maintenance }, 201);
});

// Delete a maintenance log entry.
gear.delete("/maintenance/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.prepare("DELETE FROM maintenance_log WHERE id = ?")
    .bind(id)
    .run();
  return c.body(null, 204);
});

export default gear;
