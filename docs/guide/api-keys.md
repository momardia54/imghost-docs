# Uploading with an API key

API keys let scripts, CI jobs and other tools upload images without a browser session.

## What a key can do

A key can call **`POST /api/upload`** and nothing else. It cannot list, move or delete images, manage folders, or create other keys. If a key leaks, the worst anyone can do with it is add images; revoke it and they can't do that either.

## Creating a key

1. Sidebar, **API keys**.
2. Enter a name that says where the key will be used, such as `laptop-script` or `ci-docs`, and select **Create key**.
3. Copy the key (`imghost_sk_…`). **It is shown only once**: imghost stores a SHA-256 hash of it, not the key itself.

The dialog lists each key with the first characters of its token, its creation date and when it was last used. The bin icon revokes a key immediately.

## Uploading

```bash
curl -X POST https://img.example.com/api/upload \
  -H "Authorization: Bearer imghost_sk_..." \
  -F "file=@screenshot.png" \
  -F "folder_id=12"
```

`folder_id` is optional; without it, the image goes to *Unsorted*. To find a folder's id, open `https://img.example.com/api/tree` in a browser where you are signed in: it lists every folder with its `id` and `name`.

The response, with status `201`:

```json
{
  "id": 431,
  "folder_id": 12,
  "r2_key": "0b6f2c1e-8a3d-4e57-9b1c-4f0e2d7a9c55.png",
  "original_name": "screenshot.png",
  "content_type": "image/png",
  "size": 182044,
  "created_at": "2026-10-13 14:02:11",
  "url": "https://img.example.com/i/0b6f2c1e-8a3d-4e57-9b1c-4f0e2d7a9c55.png"
}
```

`url` is the public link, ready to paste.

### From JavaScript (Node.js 18 or later)

```js
import { readFile } from "node:fs/promises"

const form = new FormData()
form.append("file", new Blob([await readFile("screenshot.png")]), "screenshot.png")

const res = await fetch("https://img.example.com/api/upload", {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.IMGHOST_KEY}` },
  body: form,
})
if (!res.ok) throw new Error((await res.json()).error)
console.log((await res.json()).url)
```

### From Python

```python
import os, requests

with open("screenshot.png", "rb") as f:
    res = requests.post(
        "https://img.example.com/api/upload",
        headers={"Authorization": f"Bearer {os.environ['IMGHOST_KEY']}"},
        files={"file": f},
    )
res.raise_for_status()
print(res.json()["url"])
```

## Errors

| Status | Meaning |
|---|---|
| `400` | No file, an empty file, a file over 10 MB, a format that is not accepted, or an invalid `folder_id` |
| `401` | Missing, wrong or revoked key |
| `404` | `folder_id` does not exist |

Every error body is `{ "error": "<message>" }`.

## Calling it from a browser

The upload endpoint sends no CORS headers, so browser code on another site cannot call it. That is deliberate: a key placed in browser code is visible to every visitor. Upload from a server or a script instead.
