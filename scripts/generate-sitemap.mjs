import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { execFile } from "node:child_process"
import { promisify } from "node:util"

import { scanRoutes } from "./scan-routes.mjs"

const execFileAsync = promisify(execFile)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")
const distDir = path.join(projectRoot, "dist")
const BASE_URL = "https://www.civilespro.com/"
const BUILD_TIMESTAMP = new Date().toISOString()
const DEFAULT_CHANGEFREQ = "weekly"

function normalizeBaseUrl(url) {
  return url.endsWith("/") ? url : `${url}/`
}

const normalizedBaseUrl = normalizeBaseUrl(BASE_URL)

function normalizeRoutePath(routePath) {
  if (typeof routePath !== "string") return null
  if (routePath === "/") return "/"
  let normalized = routePath.trim()
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`
  }
  if (normalized.endsWith("/") && normalized !== "/") {
    normalized = normalized.replace(/\/+$/, "")
  }
  return normalized
}

function priorityForPath(routePath) {
  if (routePath === "/") {
    return 1.0
  }

  const trimmed = routePath.replace(/^\/+/, "").replace(/\/+$/, "")
  if (!trimmed) {
    return 1.0
  }

  return trimmed.includes("/") ? 0.6 : 0.8
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

async function getLastMod(filePath) {
  if (!filePath) {
    return BUILD_TIMESTAMP
  }

  try {
    const relativePath = path.relative(projectRoot, filePath)
    const { stdout } = await execFileAsync("git", [
      "log",
      "-1",
      "--format=%cI",
      "--",
      relativePath,
    ])
    const commitDate = stdout.trim()
    return commitDate || BUILD_TIMESTAMP
  } catch (error) {
    return BUILD_TIMESTAMP
  }
}

async function loadStaticEntries() {
  const filePath = path.join(projectRoot, "seo", "static-entries.json")
  try {
    const content = await fs.readFile(filePath, "utf8")
    const parsed = JSON.parse(content)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed
      .map((entry) => ({
        ...entry,
        path: typeof entry.path === "string" ? entry.path : null,
      }))
      .filter((entry) => entry.path)
  } catch (error) {
    if (error.code === "ENOENT") {
      return []
    }
    throw error
  }
}

function toAbsoluteUrl(routePath) {
  if (routePath === "/") {
    return normalizedBaseUrl.replace(/\/+$/, "/")
  }

  const relativePath = routePath.replace(/^\/+/, "")
  return new URL(relativePath, normalizedBaseUrl).toString()
}

async function buildEntries() {
  const [scannedRoutes, staticEntries] = await Promise.all([
    scanRoutes(),
    loadStaticEntries(),
  ])

  const entries = new Map()

  for (const route of scannedRoutes) {
    entries.set(route.path, {
      path: route.path,
      changefreq: DEFAULT_CHANGEFREQ,
      priority: priorityForPath(route.path),
      componentFile: route.componentFile,
      sourceFile: route.sourceFile,
    })
  }

  for (const staticEntry of staticEntries) {
    const normalizedPath = normalizeRoutePath(staticEntry.path)
    if (!normalizedPath) continue
    const existing = entries.get(normalizedPath)
    const baseData =
      existing || {
        path: normalizedPath,
        changefreq: DEFAULT_CHANGEFREQ,
        priority: priorityForPath(normalizedPath),
      }

    entries.set(normalizedPath, {
      ...baseData,
      changefreq: staticEntry.changefreq || baseData.changefreq,
      priority:
        typeof staticEntry.priority === "number"
          ? staticEntry.priority
          : baseData.priority,
      explicitLastmod: staticEntry.lastmod || null,
    })
  }

  const items = Array.from(entries.values()).sort((a, b) => {
    if (a.path === b.path) return 0
    if (a.path === "/") return -1
    if (b.path === "/") return 1
    return a.path.localeCompare(b.path)
  })

  const enriched = []
  for (const item of items) {
    const lastmod = item.explicitLastmod
      ? item.explicitLastmod
      : await getLastMod(item.componentFile || item.sourceFile)

    enriched.push({
      loc: toAbsoluteUrl(item.path),
      changefreq: item.changefreq,
      priority: item.priority,
      lastmod,
    })
  }

  return enriched
}

function buildXml(urls) {
  const urlEntries = urls
    .map(
      (url) =>
        `  <url>\n` +
        `    <loc>${escapeXml(url.loc)}</loc>\n` +
        `    <lastmod>${escapeXml(url.lastmod)}</lastmod>\n` +
        `    <changefreq>${escapeXml(url.changefreq)}</changefreq>\n` +
        `    <priority>${url.priority.toFixed(1)}</priority>\n` +
        `  </url>`,
    )
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`
}

async function main() {
  const urls = await buildEntries()
  await fs.mkdir(distDir, { recursive: true })
  const xml = buildXml(urls)
  const outputPath = path.join(distDir, "sitemap.xml")
  await fs.writeFile(outputPath, xml, "utf8")
  console.log(`Generated ${outputPath}`)
}

await main()
