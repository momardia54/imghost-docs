# Image variants

Add `?size=` to an image link to get a resized copy in WebP:

```
https://img.example.com/i/0b6f2c1e-8a3d-4e57-9b1c-4f0e2d7a9c55.jpg?size=medium
```

| Preset | Width |
|---|---|
| `thumb` | 200 px |
| `small` | 400 px |
| `medium` | 800 px |
| `large` | 1600 px |

The width is a maximum: images are scaled down to fit and never enlarged, and the aspect ratio is kept. Quality is 80.

## How they are made

1. The first request for a preset generates the variant with Cloudflare's Images binding.
2. The result is stored in R2 at `thumbs/<preset>/<key>` and returned.
3. Every later request for that preset is served from R2, without transforming again.

Variants are deleted together with their image, or with the folder that contains it. The web app uses `small` for thumbnails in the grid and list, and `large` in the lightbox.

## Exceptions

- **GIFs** are always served as the original, so animations keep working. No variant is stored.
- **No `size`, or an unknown value** such as `?size=huge`: the original.
- **Transformation errors**: the original, so a link never breaks because of a variant.

## Free-tier quota

Cloudflare's free plan includes 5,000 unique transformations a month. Each image–preset pair counts once, the first time it is requested, because the result is then kept in R2. Fixed presets, rather than any width, keep that number bounded: at most four per image.

## When variants are not generated

If `?size=` returns the original (same type and size as without it) for a JPEG or PNG:

- check that `wrangler.jsonc` has `"images": { "binding": "TRANSFORM" }` and that the deployed Worker shows the binding under *Settings*, *Bindings*;
- check the Images usage in the Cloudflare dashboard for the monthly quota.

The Images binding works on accounts without a zone; a dashboard message about adding a zone refers to URL-based transformations, which imghost does not use.
