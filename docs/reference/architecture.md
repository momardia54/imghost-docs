# Architecture

imghost is one Cloudflare Worker. It serves three kinds of traffic:

| Path | Served by | Authentication |
|---|---|---|
| `/i/<key>` | The Worker, from R2 | None |
| `/api/…` | The Worker | A session cookie; for `POST /api/upload`, a session or an API key |
| Everything else | Cloudflare's static assets (the web app), without running the Worker | None; the app asks the API whether you are signed in |

## Stack

- **Runtime:** Cloudflare Workers, with plain `fetch` routing and no framework.
- **Web app:** React 19 and TypeScript, built by Vite, no UI library. Icons are inline SVG; styles are one CSS file with design tokens for the light and dark themes.
- **Data:** Cloudflare D1 (SQLite). **Images:** Cloudflare R2. **Variants:** the Images binding.
- **Tests:** Vitest inside the Workers runtime, with local D1 and R2.

## Request flow of an upload

1. The Worker accepts a session cookie or an API key (`POST /api/upload` is the only route that reads API keys).
2. It checks the size (10 MB), then reads the file's first bytes to identify the format. The file name and the browser-reported type are not trusted; SVG and unknown formats are refused.
3. The file is written to R2 under a new random key (`<uuid>.<ext>`), then recorded in D1. If the D1 insert fails, the R2 object is deleted again.

Deleting goes the other way: the D1 row first, then the R2 objects. In both directions, a failure halfway leaves at worst an invisible object in R2, never a record that points to a missing file.

## Request flow of a variant

1. `GET /i/<key>?size=<preset>` looks for `thumbs/<preset>/<key>` in R2 and returns it if present.
2. Otherwise it reads the original. GIFs are returned as they are.
3. The Images binding scales the original down to the preset width and encodes WebP at quality 80. The result is stored at `thumbs/<preset>/<key>` and returned. If the transformation fails, the original is returned.

## Data model

| Table | Holds |
|---|---|
| `folders` | Name and parent. Deleting a folder cascades to its sub-folders and their image records. |
| `files` | Folder, R2 key, original name, detected type, size, upload time. |
| `sessions` | Random session tokens with their expiry (30 days). |
| `login_attempts` | Failed sign-ins per IP address, for the rate limit. |
| `api_keys` | Name, SHA-256 hash of the token, its first characters, creation and last-use times. |

The schema is created on the first request after a deploy (`CREATE TABLE IF NOT EXISTS`); there are no migration files.

## Source layout

```
src/index.ts              router: public images, session and API key checks, API routes
src/auth.ts               credential check, sessions, API keys
src/db.ts                 D1 schema, applied on the first request
src/security.ts           security headers on every Worker response
src/routes/auth.ts        sign-in with the rate limit, sign-out, /api/me
src/routes/folders.ts     tree with recursive counts, create, rename, recursive delete
src/routes/files.ts       listing, upload with format detection, move, delete, bulk move and delete
src/routes/serve.ts       public images and variants
src/routes/apiKeys.ts     create, list and revoke API keys
frontend/                 the web app (src/), its static files and _headers (public/)
test/                     Worker tests
scripts/ensure-d1.mjs     finds or creates the D1 database and writes its id into wrangler.jsonc
```

The source is on [GitHub](https://github.com/momardia54/imghost).
