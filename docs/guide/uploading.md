# Uploading

## From the web app

There are three ways to upload. They all go to the folder you are looking at, or to *Unsorted* from *All images* and *Unsorted*. During a search, uploads go to the folder you were in before searching.

- **Drop** files anywhere on the page. An overlay shows where they will go.
- **Paste** an image with Cmd+V or Ctrl+V, for example a screenshot copied to the clipboard.
- **Upload** in the top bar, or the button on an empty folder, to pick files.

Three files upload at a time. A panel in the bottom-right corner shows each file's progress, then a button to copy its link. Files that fail stay in the list with the reason.

## What is accepted

| | |
|---|---|
| Formats | JPEG, PNG, GIF, WebP, AVIF |
| Size | Up to 10 MB per file |
| Not accepted | SVG, and anything that is not one of the formats above |

The web app checks type and size before sending anything. The Worker then checks again by reading the file's first bytes: the file name and the type the browser reports are ignored. A PNG named `photo.gif` is stored as a PNG; an HTML file renamed `photo.png` is refused.

Each image is stored under a new random key with the extension of its real format, such as `0b6f2c1e-8a3d-4e57-9b1c-4f0e2d7a9c55.png`. The original file name is kept for display and search.

## From scripts and other tools

Create an API key and send the file to `POST /api/upload`. See [Uploading with an API key](/guide/api-keys).

## Metadata

imghost stores files exactly as uploaded. Photos keep their EXIF data, which can include the GPS location where they were taken, and anyone with the link can read it. Remove location data before uploading photos you would not want located. Stripping it automatically is on the [roadmap](/project/roadmap).
