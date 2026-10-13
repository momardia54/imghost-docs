---
layout: home

hero:
  name: imghost
  text: Your own image host on Cloudflare
  tagline: A self-hosted image host on Cloudflare Workers, D1 and R2, within the free tier. Upload images, organize them in folders, and share direct links, resized variants or ready-made Markdown and HTML.
  actions:
    - theme: brand
      text: Get started
      link: /getting-started
    - theme: alt
      text: What is imghost
      link: /introduction
    - theme: alt
      text: API reference
      link: /reference/api

features:
  - title: Direct public links
    details: Every image gets a permanent link at /i/<key>, served from R2 with year-long caching. Copy it as a URL, Markdown, HTML or BBCode.
    link: /guide/sharing
    linkText: Links and sharing
  - title: Resized variants
    details: Add ?size=thumb, small, medium or large to any link for a WebP resized on first request and stored for every request after it.
    link: /guide/variants
    linkText: Image variants
  - title: Folders that scale
    details: Nested folders, an Unsorted view, search, sorting, multi-select and bulk move or delete, in a grid or a list.
    link: /guide/library
    linkText: Organizing the library
  - title: Upload from anywhere
    details: Drop files anywhere on the page, paste from the clipboard, or pick files. Type and size are checked before anything is sent.
    link: /guide/uploading
    linkText: Uploading
  - title: Upload API
    details: Create revocable API keys that can upload and do nothing else, for scripts, CI jobs and other tools.
    link: /guide/api-keys
    linkText: API keys
  - title: Free tier, one account
    details: One Worker, one D1 database, one R2 bucket. Credentials live in Workers secrets. One click to deploy.
    link: /deployment
    linkText: Deployment
---

<div class="home-screenshot">

![The imghost library: folders in the sidebar, a folder's sub-folders and images in a grid](/screenshots/gallery-dark.jpg)

</div>
