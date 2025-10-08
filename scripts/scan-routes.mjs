import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")
const srcDir = path.join(projectRoot, "src")
const allowedExtensions = new Set([".js", ".jsx", ".ts", ".tsx"])

function normalizePath(routePath) {
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

async function buildImportMap(code, filePath) {
  const importRegex = /import\s+([^;]+?)\s+from\s+["']([^"']+)["']/g
  const map = new Map()
  const dir = path.dirname(filePath)

  let match
  while ((match = importRegex.exec(code)) !== null) {
    const [_, specifiersRaw, source] = match
    const specifiers = specifiersRaw.split(",").map((item) => item.trim()).filter(Boolean)

    if (specifiers.length === 0) continue

    const defaultSpecifier = specifiers.find((item) => !item.startsWith("{"))
    if (!defaultSpecifier) continue

    const identifier = defaultSpecifier.replace(/\sas\s.+$/, "").trim()
    if (!identifier) continue

    if (!source.startsWith(".")) continue

    const resolved = path.resolve(dir, source)
    const resolvedWithExt = await awaitResolveWithExtension(resolved)
    if (resolvedWithExt) {
      map.set(identifier, resolvedWithExt)
    }
  }

  return map
}

async function awaitResolveWithExtension(resolved) {
  const candidates = ["", ".js", ".jsx", ".ts", ".tsx", "/index.js", "/index.jsx", "/index.ts", "/index.tsx"]

  for (const candidate of candidates) {
    const filePath = resolved + candidate
    try {
      const stat = await fs.stat(filePath)
      if (stat.isFile()) {
        return filePath
      }
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error
      }
    }
  }

  return null
}

function extractRoutes(code) {
  const routeRegex = /<Route\s+([\s\S]*?)(?:\/>|>)/g
  const routes = []
  let match

  while ((match = routeRegex.exec(code)) !== null) {
    const attrs = match[1]

    const pathMatch = attrs.match(/path\s*=\s*["'`]([^"'`]+)["'`]/)
    if (!pathMatch) continue
    const rawPath = pathMatch[1].trim()
    if (!rawPath || rawPath.includes(":") || rawPath.includes("*")) continue

    const elementMatch = attrs.match(/element\s*=\s*\{\s*<\s*([A-Za-z0-9_]+)/)
    const componentName = elementMatch ? elementMatch[1] : null
    const component = componentName === "Navigate" ? null : componentName

    routes.push({ path: normalizePath(rawPath), component })
  }

  return routes
}

async function walkDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (["node_modules", "dist", "build", "scripts"].includes(entry.name)) continue
      files.push(...(await walkDir(fullPath)))
    } else if (allowedExtensions.has(path.extname(entry.name))) {
      files.push(fullPath)
    }
  }

  return files
}

export async function scanRoutes() {
  const files = await walkDir(srcDir)
  const routeMap = new Map()

  for (const filePath of files) {
    const code = await fs.readFile(filePath, "utf8")
    if (!code.includes("<Route")) continue

    const importMap = await buildImportMap(code, filePath)
    const routes = extractRoutes(code)

    for (const route of routes) {
      const existing = routeMap.get(route.path)
      const componentFile = route.component ? importMap.get(route.component) : undefined

      if (!existing) {
        routeMap.set(route.path, {
          path: route.path,
          component: route.component ?? null,
          componentFile: componentFile ?? null,
          sourceFile: filePath,
        })
      }
    }
  }

  const sorted = Array.from(routeMap.values()).sort((a, b) => {
    if (a.path === b.path) return 0
    if (a.path === "/") return -1
    if (b.path === "/") return 1
    return a.path.localeCompare(b.path)
  })

  return sorted
}

const invokedDirectly = Boolean(
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url),
)

if (invokedDirectly) {
  const routes = await scanRoutes()
  console.log(JSON.stringify(routes, null, 2))
}
