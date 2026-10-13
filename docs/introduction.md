# What is imghost

imghost is an image host you deploy to your own Cloudflare account. It is made for one person who needs somewhere to put images and link to them: screenshots for issues and docs, images for a blog or a newsletter, assets for a site. It runs on the Workers free plan.

![The imghost library](/screenshots/gallery-dark.jpg)

## How it works

1. You **upload** an image from the web app or with an API key. imghost checks that it really is an image, stores it in R2 under a random key, and records it in D1.
2. The image is immediately available at a **public link**, `https://<your-worker>/i/<key>`, which anyone can open without signing in.
3. Add `?size=` to the link to get a **resized WebP**. It is generated the first time someone asks for it, then served from R2.

```
https://img.example.com/i/0b6f2c1e-8a3d-4e57-9b1c-4f0e2d7a9c55.jpg
https://img.example.com/i/0b6f2c1e-8a3d-4e57-9b1c-4f0e2d7a9c55.jpg?size=medium
```

Everything else (folders, search, moving, deleting, API keys) happens in the web app behind a sign-in.

## Concepts

| Term | Meaning |
|---|---|
| Library | All images of the installation. *All images* shows every one of them. |
| Folder | A named group of images. Folders nest without a fixed depth; a folder's view includes its sub-folders' images. |
| Unsorted | Images that are not in any folder. |
| Key | The random name an image is stored under in R2, such as `0b6f2c1e-….jpg`. It is part of the public link and never changes. |
| Public link | `/i/<key>`. No sign-in, cached by browsers for a year. |
| Variant | A WebP copy of an image at a preset width (`thumb`, `small`, `medium`, `large`), stored in R2 next to the original. |
| API key | A token (`imghost_sk_…`) that can call the upload endpoint and nothing else. |

## What imghost does not do

- **Host for several people.** There is one admin account, by design. Anyone with a link can view an image; only the admin can upload, move or delete.
- **Keep images private.** Every uploaded image is public to whoever has its link. Links can't be guessed, but anyone you share one with can pass it on.
- **Strip metadata.** Photos keep their EXIF data, including GPS location if the camera recorded it. Remove it before uploading anything sensitive. See [Security](/project/security).
- **Accept SVG.** SVG files can carry scripts and images are served from the app's own address, so they are refused.

## Requirements

- A Cloudflare account. R2 has to be activated once (Cloudflare asks for a payment method, even for the free tier).
- For working on imghost itself: Node.js 22.

Free-tier limits that matter in practice: 10 GB of R2 storage and 5,000 unique image transformations a month. The storage meter in the sidebar shows how much of the 10 GB is used.

Next: [Getting started](/getting-started).
