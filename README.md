# imghost documentation

The documentation website of [imghost](https://github.com/momardia54/imghost), built with [VitePress](https://vitepress.dev).

## Where the content lives

| Pages | Source |
|---|---|
| Home, introduction, getting started, deployment, configuration, upgrading, local development, guides, HTTP API, architecture | This repository, `docs/` |
| Security, roadmap, changelog, license, screenshots, logo, OpenAPI description, version | The imghost repository (root files, `assets/`, `frontend/public/openapi.json`), copied by `npm run sync` |

A synced page starts with a comment naming its source; edit it there, never here.

## Commands

Requirements: Node.js 22.

```bash
npm install
npm run sync          # copy from the imghost working copy, ../imghost (or IMGHOST_DIR=/path/to/imghost)
npm run sync:release  # copy from imghost's main branch on GitHub: the released version
npm run dev           # http://localhost:5173, reloads on change
npm run build         # static site in docs/.vitepress/dist; fails on broken links
npm run preview       # serve the build
npm run deploy        # build and deploy as the static Worker "imghost-docs" (wrangler.jsonc)
```

## Publishing

The site is meant to be a Worker connected to this repository (Workers Builds): build command `npm run build`, deploy command `npx wrangler deploy`, production branch `main`, environment variable `NODE_VERSION=22`.

`npm run sync` records the imghost version and whether it is released (imghost's `main` on GitHub has it) in `docs/.vitepress/version.json`. A build of `main` (`WORKERS_CI_BRANCH=main`, or `DOCS_RELEASE=1`) stops with an error when the pages describe an unreleased version, so the public site never documents features an installation does not have. Unreleased builds show the version as "next" in the navigation bar.

After a change in imghost (docs, screenshots, changelog or version): `npm run sync`, check with `npm run build`, and commit the synced files.

## License

MIT, as imghost. See [LICENSE](LICENSE).
