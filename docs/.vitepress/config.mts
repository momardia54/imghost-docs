import fs from "node:fs"
import path from "node:path"
import { defineConfig, type DefaultTheme } from "vitepress"
import { released, version } from "./version.json"

/** Leaves out sidebar entries whose page does not exist, such as a page added after the version being built. */
function existing(groups: DefaultTheme.SidebarItem[]): DefaultTheme.SidebarItem[] {
  const docs = path.resolve(import.meta.dirname, "..")
  return groups.map((g) => ({ ...g, items: g.items?.filter((i) => !i.link || fs.existsSync(path.join(docs, `${i.link}.md`))) }))
}

export default defineConfig({
  title: "imghost",
  description: "Self-hosted image host on Cloudflare Workers, D1 and R2: folders, direct links, resized variants and an upload API.",
  lang: "en-US",
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
    ["meta", { name: "theme-color", content: "#6e77f0" }],
  ],
  markdown: { theme: { light: "github-light", dark: "github-dark" } },
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "Guide", link: "/getting-started", activeMatch: "^/(getting-started|introduction|deployment|configuration|upgrading|local-development|guide/)" },
      { text: "API", link: "/reference/api", activeMatch: "^/reference/" },
      {
        text: released ? `v${version}` : `v${version} (next)`,
        items: [
          { text: "Changelog", link: "/project/changelog" },
          { text: "Roadmap", link: "/project/roadmap" },
        ],
      },
    ],
    sidebar: existing([
      {
        text: "Introduction",
        items: [
          { text: "What is imghost", link: "/introduction" },
          { text: "Getting started", link: "/getting-started" },
        ],
      },
      {
        text: "Running imghost",
        items: [
          { text: "Deployment", link: "/deployment" },
          { text: "Configuration", link: "/configuration" },
          { text: "Upgrading", link: "/upgrading" },
          { text: "Local development", link: "/local-development" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Organizing the library", link: "/guide/library" },
          { text: "Uploading", link: "/guide/uploading" },
          { text: "Links and sharing", link: "/guide/sharing" },
          { text: "Image variants", link: "/guide/variants" },
          { text: "Uploading with an API key", link: "/guide/api-keys" },
          { text: "Keyboard shortcuts", link: "/guide/shortcuts" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "HTTP API", link: "/reference/api" },
          { text: "Architecture", link: "/reference/architecture" },
        ],
      },
      {
        text: "Project",
        items: [
          { text: "Security", link: "/project/security" },
          { text: "Roadmap", link: "/project/roadmap" },
          { text: "Changelog", link: "/project/changelog" },
          { text: "License", link: "/project/license" },
        ],
      },
    ]),
    search: { provider: "local" },
    outline: { level: [2, 3], label: "On this page" },
    socialLinks: [{ icon: "github", link: "https://github.com/momardia54/imghost" }],
    editLink: {
      pattern: ({ filePath }) => {
        // VitePress sends this function to the browser as source, so the map of synced pages lives inside it:
        // pages copied from the imghost repository by scripts/sync.mjs are edited there.
        const synced: Record<string, string> = {
          "project/security.md": "SECURITY.md",
          "project/roadmap.md": "ROADMAP.md",
          "project/changelog.md": "CHANGELOG.md",
          "project/license.md": "LICENSE",
        }
        return synced[filePath]
          ? `https://github.com/momardia54/imghost/edit/main/${synced[filePath]}`
          : `https://github.com/momardia54/imghost-docs/edit/main/docs/${filePath}`
      },
      text: "Edit this page on GitHub",
    },
    footer: {
      message: "Released under the MIT license.",
      copyright: "Copyright Momar Dia",
    },
  },
})
