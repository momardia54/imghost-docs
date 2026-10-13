# Getting started

This page takes you from nothing to a shared image link. It takes about five minutes.

## 1. Deploy

Select **Deploy to Cloudflare**:

<p><a href="https://deploy.workers.cloudflare.com/?url=https://github.com/momardia54/imghost"><img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare"></a></p>

Cloudflare copies the imghost repository to your GitHub account and creates:

- the **Worker** that serves the web app, the API and the public image links;
- a **D1 database** for folders, image records, sessions and API keys;
- an **R2 bucket** for the images and their variants.

The form asks for `ADMIN_USERNAME` and `ADMIN_PASSWORD`. These become the only login of your installation.

If the first build fails with `D1 binding 'DB' references database '...' which was not found`, see [Deployment](/deployment#the-first-build-fails-with-database-not-found). To deploy from the command line instead, see [Deployment](/deployment#command-line).

## 2. Sign in

Open your Worker's address. If the credentials were not set during deployment, the page says so and explains where to add them: *Workers & Pages*, your Worker, *Settings*, *Variables and Secrets*, two secrets named `ADMIN_USERNAME` and `ADMIN_PASSWORD`. They apply without a redeploy. All settings are in [Configuration](/configuration).

![The sign-in page](/screenshots/login-dark.jpg)

## 3. Use your own domain (optional)

Image links end up in documents, posts and sites, so an address you control is worth setting up before you share many: *Workers & Pages*, your Worker, *Settings*, *Domains & Routes*, *Add*, *Custom domain*, for example `img.example.com`. Links shared with the `workers.dev` address keep working, as long as the `workers.dev` route stays enabled.

## 4. Upload an image

Drop an image anywhere on the page, paste one with Cmd+V or Ctrl+V, or select **Upload**. Uploads go to the folder you are looking at, or to *Unsorted* from *All images*.

To create a folder, select the folder icon next to **Folders** in the sidebar. [Organizing the library](/guide/library) covers folders, moving and selecting.

## 5. Share it

Select the image to open it. The **Share** panel copies the link as a URL, Markdown, HTML or BBCode, at the original size or as a resized variant.

![The lightbox with the share panel](/screenshots/lightbox.jpg)

Hovering over an image in the grid also shows a button that copies its link directly.

## 6. Next steps

- Upload from scripts or CI: [Uploading with an API key](/guide/api-keys).
- Use smaller images in pages and posts: [Image variants](/guide/variants).
- Learn the shortcuts: [Keyboard shortcuts](/guide/shortcuts).
- Before sharing widely, read [Security](/project/security).
