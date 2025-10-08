import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")
const distDir = path.join(projectRoot, "dist")

const BASE_SITEMAP_URL = "https://www.civilespro.com/sitemap.xml"
const CONTENT = `User-agent: *
Allow: /
Sitemap: ${BASE_SITEMAP_URL}
`

async function main() {
  await fs.mkdir(distDir, { recursive: true })
  const outputPath = path.join(distDir, "robots.txt")
  await fs.writeFile(outputPath, CONTENT, "utf8")
  console.log(`Generated ${outputPath}`)
}

await main()
