# Links and sharing

## Public links

Every image has one permanent link:

```
https://<your-worker>/i/<key>
```

Anyone can open it without signing in. The key is random, so links cannot be guessed, but they are not secret: whoever has a link can pass it on. Moving an image to another folder does not change its link; deleting it does break the link.

## Copying a link

- **From the grid**: hover over an image and select the link button in its top-right corner.
- **From the lightbox**: open an image; the **Share** panel copies it in four formats.
- **Several at once**: select images and choose **Copy links**, one link per line.

| Format | Copies |
|---|---|
| Link | `https://img.example.com/i/0b6f….jpg` |
| Markdown | `![sunset](https://img.example.com/i/0b6f….jpg)` |
| HTML | `<img src="https://img.example.com/i/0b6f….jpg" alt="sunset">` |
| BBCode | `[img]https://img.example.com/i/0b6f….jpg[/img]` |

The alternative text is the file name without its extension. The size menu adds `?size=` to the link for a [resized variant](/guide/variants); GIFs are always shared at their original size. Your choice of format and size is remembered by your browser.

![The lightbox's share panel](/screenshots/lightbox.jpg)

## The lightbox

Select an image to open it. Use the arrow keys (or the buttons at the sides) to move through the images of the current view, `i` to show or hide the details panel, `c` to copy the current snippet, and Esc to close. The top bar opens the original in a new tab or downloads it.

The details panel shows the file name, folder, type, size and upload time, with **Move** and **Delete**.

## Caching

Image responses carry `Cache-Control: public, max-age=31536000, immutable`: browsers and proxies keep them for a year without asking again. That makes repeat views free and fast, and it is safe because a key never points to different content.

The flip side: after you delete an image, a browser that already loaded it can keep showing it from its own cache. New visitors get a 404.
