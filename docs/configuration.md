# Configuration

imghost has two settings, both secrets, and four bindings declared in `wrangler.jsonc`. Everything else is fixed in the code.

## Secrets

Set them in the Cloudflare dashboard (your Worker, *Settings*, *Variables and Secrets*, type *Secret*) or with `npx wrangler secret put <NAME>`. Changes apply without a redeploy.

| Name | Required | Description |
|---|---|---|
| `ADMIN_USERNAME` | Yes | The only login username. |
| `ADMIN_PASSWORD` | Yes | The only login password. Use a long, unique one. |

Until both exist, the app shows a page explaining how to add them, and `POST /api/login` answers `503`.

Changing either secret does not sign out existing sessions: a session stays valid for 30 days or until you sign out. Rotating the password is also the account recovery procedure; there is no email reset.

## Bindings

| Binding | Type | Name in `wrangler.jsonc` | Purpose |
|---|---|---|---|
| `DB` | D1 database | `imghost-db` | Folders, image records, sessions, login attempts, API keys |
| `IMAGES` | R2 bucket | `imghost-images` | Originals, and variants under `thumbs/` |
| `TRANSFORM` | Images | | Generates resized variants. Optional: without it, `?size=` serves the original |
| `ASSETS` | Static assets | `frontend-dist/` | The web app, served without running the Worker |

## Limits

These are set in the code and apply to every installation.

| Limit | Value |
|---|---|
| Upload size | 10 MB per file |
| Formats | JPEG, PNG, GIF, WebP, AVIF (identified by content) |
| Folder and API key names | 100 characters |
| Stored file names | 255 characters |
| Images per bulk request | 500 |
| Images per list request | 100 (default 24) |
| Failed sign-ins | 8 per IP address per 15 minutes |
| Session length | 30 days |

## Security headers

Every response carries a Content Security Policy that allows scripts, styles and fonts from the app's own address only, plus `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer` and HSTS. The Worker adds them to its own responses (`src/security.ts`); the static web app gets the same set from `frontend/public/_headers`. If you change one, change the other.
