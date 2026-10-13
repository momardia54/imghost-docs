# HTTP API

The web app uses this API, and you can too. All endpoints are under the Worker's address.

::: tip OpenAPI
Every installation serves an OpenAPI 3.1 description of this API at `/openapi.json`, for client generators, Postman, Insomnia or any OpenAPI viewer. The description of the current version is also <a href="/openapi.json" target="_blank">available here</a>.
:::

## Authentication

| Method | Used for | How |
|---|---|---|
| Session cookie | Every `/api/*` endpoint | `POST /api/login`, then send the `imghost_session` cookie it sets |
| API key | `POST /api/upload` only | `Authorization: Bearer imghost_sk_…` ([API keys](/guide/api-keys)) |
| None | `GET /i/<key>`, `GET /api/me`, `POST /api/login` | |

An API key sent to any other endpoint is ignored, and the request gets `401`.

## Conventions

- Request bodies are JSON (`Content-Type: application/json`), except uploads (`multipart/form-data`).
- Errors are `{ "error": "<message>" }` with a `4xx` or `5xx` status. `401` means no valid session (or key, for uploads).
- Times are UTC in D1's format, `YYYY-MM-DD HH:MM:SS`, without a zone marker.
- Ids are positive integers. `folder_id: null` means *Unsorted* (no folder).

## Session

### `POST /api/login`

```json
{ "username": "me", "password": "…" }
```

| Status | |
|---|---|
| `200` | `{ "ok": true }`, and a `Set-Cookie: imghost_session=…; HttpOnly; Secure; SameSite=Lax` valid for 30 days |
| `400` | Username or password missing |
| `401` | Wrong credentials |
| `429` | 8 failed attempts from this IP address in the last 15 minutes. Refused even with the right password until the window passes |
| `503` | `ADMIN_USERNAME` or `ADMIN_PASSWORD` is not set |

### `POST /api/logout`

Deletes the session. `{ "ok": true }`.

### `GET /api/me`

```json
{ "authenticated": true, "configured": true }
```

`configured` is false until both admin secrets are set.

## Folders

### `GET /api/tree`

Every folder, with recursive image counts, and library totals.

```json
{
  "folders": [
    { "id": 3, "parent_id": null, "name": "Travel", "count": 10 },
    { "id": 7, "parent_id": 3, "name": "Japan", "count": 4 }
  ],
  "total": 32,
  "bytes": 7170824
}
```

`count` includes the images of all sub-folders. `total` is the number of images in the library, `bytes` their total size.

### `POST /api/folders`

```json
{ "name": "Japan", "parent_id": 3 }
```

`parent_id` is `null` or absent for a top-level folder. Names are trimmed and cut to 100 characters. `201` with `{ "id", "name", "parent_id" }`; `400` without a name; `404` if the parent does not exist.

### `PATCH /api/folders/:id`

```json
{ "name": "Kyoto" }
```

`{ "ok": true, "id", "name" }`; `404` if the folder does not exist.

### `DELETE /api/folders/:id`

Deletes the folder, all its sub-folders, their images and the images' variants. `{ "ok": true }`; `404` if the folder does not exist.

## Images

An image record:

```json
{
  "id": 431,
  "folder_id": 7,
  "r2_key": "0b6f2c1e-8a3d-4e57-9b1c-4f0e2d7a9c55.jpg",
  "original_name": "arashiyama.jpg",
  "content_type": "image/jpeg",
  "size": 238114,
  "created_at": "2026-10-13 14:02:11",
  "url": "/i/0b6f2c1e-8a3d-4e57-9b1c-4f0e2d7a9c55.jpg"
}
```

### `GET /api/files`

Lists images. What is listed depends on the parameters:

| Parameter | Lists |
|---|---|
| `q=<text>` | Images whose file name contains the text, in every folder. `%` and `_` match literally. Up to 100 characters |
| `scope=all` | Every image |
| `folder_id=<id>` | The folder's images and those of all its sub-folders |
| none of these | *Unsorted* images |

`q` takes precedence over `scope`, which takes precedence over `folder_id`.

| Parameter | Default | |
|---|---|---|
| `sort` | `newest` | `newest`, `oldest`, `name` (A to Z, case-insensitive) or `size` (largest first). Unknown values sort by `newest` |
| `limit` | `24` | 1 to 100 |
| `offset` | | Number of images to skip. Takes precedence over `page` |
| `page` | `1` | Page number of `limit` images |

```json
{ "files": [ /* image records */ ], "total": 71, "page": 1, "pageSize": 24 }
```

`total` counts every match, not only this page. Use `offset` when the list can change while you read it: after deleting or moving images, `offset` set to the number you already have continues where you left off, where a page number would skip some.

In this list, `url` is relative (`/i/<key>`).

### `POST /api/upload`

`multipart/form-data` with:

| Field | |
|---|---|
| `file` | The image. JPEG, PNG, GIF, WebP or AVIF, up to 10 MB, identified by its content |
| `folder_id` | Optional. Without it, the image goes to *Unsorted* |

Accepts a session or an API key. `201` with the image record, where `url` is absolute. `400` for no file, an empty or too large file, an unsupported format or an invalid `folder_id`; `404` if the folder does not exist.

### `PATCH /api/files/:id`

Moves one image.

```json
{ "folder_id": 7 }
```

`{ "ok": true, "folder_id": 7 }`. `400` without `folder_id`; `404` if the image or the folder does not exist.

### `DELETE /api/files/:id`

Deletes one image and its variants. `{ "ok": true }`; `404` if it does not exist.

### `POST /api/files/move`

Moves several images in one request.

```json
{ "ids": [431, 432, 433], "folder_id": null }
```

`ids` holds 1 to 500 positive integers; duplicates are ignored, and ids that do not exist are skipped. `{ "ok": true, "moved": 3, "folder_id": null }`. `400` for invalid `ids` or a missing `folder_id`; `404` if the folder does not exist.

### `POST /api/files/delete`

Deletes several images and their variants in one request.

```json
{ "ids": [431, 432, 433] }
```

Same rules for `ids`. `{ "ok": true, "deleted": 3 }`, where `deleted` counts the images that existed.

## API keys

Session only. An API key cannot manage keys.

### `GET /api/keys`

```json
{ "keys": [ { "id": 2, "name": "ci-docs", "key_prefix": "imghost_sk_6", "created_at": "2026-10-13 15:04:22", "last_used_at": null } ] }
```

### `POST /api/keys`

```json
{ "name": "ci-docs" }
```

`201` with `{ "id", "name", "token", "key_prefix", "created_at" }`. `token` is the full key, returned this once only. `400` without a name.

### `DELETE /api/keys/:id`

Revokes the key immediately. `{ "ok": true }`; `404` if it does not exist.

## Public images

### `GET /i/:key`

The image, with `Cache-Control: public, max-age=31536000, immutable`. No authentication.

| Parameter | |
|---|---|
| `size` | Optional: `thumb` (200 px), `small` (400), `medium` (800) or `large` (1600). A WebP scaled down to that width, generated once and stored. GIFs and unknown values return the original. See [Image variants](/guide/variants) |

`404` if the key does not exist.
