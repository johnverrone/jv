import { Hono } from 'hono'
import gear from './routes/gear'
import { bearerAuth } from './middleware/auth'

type Bindings = {
  DB: D1Database
  HOBBIES_WRITE_TOKEN?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Private, server-to-server backend for the johnverrone command center. The
// SvelteKit app calls this with `Authorization: Bearer <HOBBIES_WRITE_TOKEN>`;
// no browser ever hits it, so there is no CORS. Every route requires auth.
app.use('*', bearerAuth)
app.route('/', gear)

export default app
