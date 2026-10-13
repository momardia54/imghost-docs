// Copies the project pages, screenshots, logo and version from the imghost repository into this site, so they
// have one source: those files change together with the code, and this script brings them here. Run it after an
// imghost change:
//
//   npm run sync                          from the imghost working copy (expects it next to this one: ../imghost)
//   npm run sync:release                  from imghost's main branch on GitHub (git fetch first): the released
//                                         version, which is what the public site shows
//   IMGHOST_DIR=/path/to/imghost npm run sync
//
// Synced pages carry a notice at the top and must be edited in imghost, not here. Relative links are rewritten to
// the page's address on this site, or to the file on GitHub when the target is not a page of the site.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"

const here = path.dirname(fileURLToPath(import.meta.url))
const site = path.join(here, "..", "docs")
const imghost = path.resolve(process.env.IMGHOST_DIR ?? path.join(here, "..", "..", "imghost"))
const GITHUB = "https://github.com/momardia54/imghost/blob/main"

/** imghost file (relative to its root) → page of this site (relative to docs/). */
const PAGES = {
  "SECURITY.md": "project/security.md",
  "ROADMAP.md": "project/roadmap.md",
  "CHANGELOG.md": "project/changelog.md",
  LICENSE: "project/license.md",
}

if (!fs.existsSync(path.join(imghost, "package.json"))) {
  console.error(`imghost repository not found at ${imghost}. Set IMGHOST_DIR to its path.`)
  process.exit(1)
}

const git = (...args) => execFileSync("git", ["-C", imghost, ...args], { maxBuffer: 64 * 1024 * 1024 })
// --release reads imghost's main branch as it is on GitHub, whatever is checked out locally.
const ref = process.argv.includes("--release") ? "origin/main" : null
if (ref) git("fetch", "--quiet", "origin", "main")
/** A file of the imghost repository, from `ref` or from the working copy. */
const read = (file) => (ref ? git("show", `${ref}:${file}`) : fs.readFileSync(path.join(imghost, file)))
const readText = (file) => read(file).toString("utf8")

/** Rewrites one Markdown link target found in `source` (an imghost path) for the page at `target` (a site path). */
function rewrite(href, source, target) {
  if (/^(?:[a-z]+:|#|\/)/i.test(href)) return href
  const [file, anchor = ""] = href.split("#")
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(source), file))
  const hash = anchor ? `#${anchor}` : ""
  if (PAGES[resolved]) {
    const relative = path.posix.relative(path.posix.dirname(target), PAGES[resolved])
    return `${relative.startsWith(".") ? relative : `./${relative}`}${hash}`
  }
  if (resolved.startsWith("assets/screenshots/")) return `/screenshots/${path.posix.basename(resolved)}`
  return `${GITHUB}/${resolved}${hash}`
}

let pages = 0
for (const [source, target] of Object.entries(PAGES)) {
  const text = readText(source)
  // Links outside code: [text](target) and ![alt](target). Fenced code blocks are left untouched.
  const parts = text.split(/(^```[\s\S]*?^```)/m)
  const body = parts.map((part, i) => (i % 2 === 1 ? part : part.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)\)/g, (_, bang, label, href) => `${bang}[${label}](${rewrite(href, source, target)})`))).join("")
  const notice = `<!-- Synced from imghost/${source} by scripts/sync.mjs. Edit it there, then run npm run sync. -->\n\n`
  // Every page needs a title; the license file starts with plain text.
  const title = body.trimStart().startsWith("# ") ? "" : `# ${path.basename(target, ".md").replace(/^./, (c) => c.toUpperCase())}\n\n`
  const out = path.join(site, target)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, notice + title + body)
  pages++
}

// Screenshots and the logo.
const shots = (ref
  ? git("ls-tree", "--name-only", `${ref}:assets/screenshots`).toString("utf8").split("\n").filter(Boolean)
  : fs.readdirSync(path.join(imghost, "assets", "screenshots"))
).filter((file) => !file.startsWith("."))
fs.mkdirSync(path.join(site, "public", "screenshots"), { recursive: true })
for (const file of shots) fs.writeFileSync(path.join(site, "public", "screenshots", file), read(`assets/screenshots/${file}`))
fs.writeFileSync(path.join(site, "public", "logo.svg"), read("assets/logo.svg"))

// The version comes from imghost itself. It is released when imghost's main branch on GitHub has it (or a later
// one); the production build refuses to publish documentation of an unreleased version (scripts/check-release.mjs).
const version = JSON.parse(readText("package.json")).version
let releasedVersion = null
try {
  if (!ref) git("fetch", "--quiet", "origin", "main")
  releasedVersion = JSON.parse(git("show", "origin/main:package.json").toString("utf8")).version
} catch {
  console.warn("Could not read imghost's main branch on GitHub: the version is marked as unreleased.")
}
const numbers = (v) => v.split(".").map(Number)
const notAfter = (a, b) => {
  const [x, y] = [numbers(a), numbers(b)]
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i]
  return true
}
const released = releasedVersion !== null && notAfter(version, releasedVersion)
const source = ref ? `main@${git("rev-parse", "--short", ref).toString("utf8").trim()}` : `working copy (${git("branch", "--show-current").toString("utf8").trim()})`
fs.writeFileSync(path.join(site, ".vitepress", "version.json"), `${JSON.stringify({ version, released, source }, null, 2)}\n`)

console.log(`Synced ${pages} pages, ${shots.length} screenshots and version ${version} (${released ? "released" : "not released"}) from imghost ${source}.`)
