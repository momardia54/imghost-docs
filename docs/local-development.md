# Local development

Requirements: Node.js 22.

## Running it

```bash
git clone https://github.com/momardia54/imghost.git && cd imghost
npm install
cp .dev.vars.example .dev.vars   # set ADMIN_USERNAME and ADMIN_PASSWORD
npm run dev                      # http://localhost:8787
```

`npm run dev` builds the web app and starts `wrangler dev`. D1 and R2 run locally (their data is in `.wrangler/state/`); nothing touches your Cloudflare account.

To work on the web app with hot reload, run `npm run dev` in one terminal and `npm run dev:frontend` in another. Vite serves the app and forwards `/api` and `/i` to the Worker on port 8787.

::: tip A blank page after rebuilding
If you rebuild the web app while `wrangler dev` is running, it can keep serving the old `index.html` with the new script names, and the page loads blank with no error. Stop it, delete `.wrangler/state/`, rebuild and start again.
:::

## Checks

The same three checks run in CI on every push and pull request:

```bash
npm run typecheck   # the Worker, the web app and the tests
npm run build       # the tests need frontend-dist/ to exist
npm test
```

The tests use Vitest with Cloudflare's Workers integration: they send real requests to the Worker inside the Workers runtime, with local D1 and R2. They cover sign-in and the rate limit, upload checks, listing, sorting and search, bulk actions, image serving, variant cleanup and API key scope. Add a test with every change to an endpoint.

## Source layout

```
src/                 the Worker (see Architecture)
frontend/            the web app: React and TypeScript, built by Vite into frontend-dist/
  src/components/    sidebar, folder tree, toolbar, gallery, lightbox, uploads, dialogs
  src/lib/           formatting, per-browser preferences, bulk actions
  public/_headers    security headers for the static files
test/                Worker tests
scripts/ensure-d1.mjs
```

More in [Architecture](/reference/architecture).
