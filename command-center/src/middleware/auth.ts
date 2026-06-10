import { createMiddleware } from "hono/factory";

/** Constant-time string comparison (length leak is acceptable here). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Guards the server-to-server write API. The SvelteKit server sends
 * `Authorization: Bearer <HOBBIES_WRITE_TOKEN>`; the token never reaches a
 * browser. Same shape as the existing MCP_AUTH_TOKEN check in index.ts.
 */
export const bearerAuth = createMiddleware<{
  Bindings: { HOBBIES_WRITE_TOKEN?: string };
}>(async (c, next) => {
  const expected = c.env.HOBBIES_WRITE_TOKEN;
  const header = c.req.header("Authorization") ?? "";
  const prefix = "Bearer ";
  const token = header.startsWith(prefix) ? header.slice(prefix.length) : "";

  if (!expected || !safeEqual(token, expected)) {
    return c.text("Unauthorized", 401);
  }

  await next();
});
