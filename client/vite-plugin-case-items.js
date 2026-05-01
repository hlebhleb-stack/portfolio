import fs from 'node:fs'
import path from 'node:path'

const ASSET_RE = /^\d+(\.[a-z0-9-]+)?\.(mp4|png|jpg|jpeg|webp)$/i
const VIDEO_RE = /\.mp4$/i

function naturalCompare(a, b) {
  const na = parseInt(a, 10)
  const nb = parseInt(b, 10)
  if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) return na - nb
  return a.localeCompare(b, undefined, { numeric: true })
}

function buildItems(rootDir) {
  if (!fs.existsSync(rootDir)) return {}
  const result = {}
  for (const slug of fs.readdirSync(rootDir)) {
    const dir = path.join(rootDir, slug)
    if (!fs.statSync(dir).isDirectory()) continue
    const files = fs.readdirSync(dir)
      .filter(f => ASSET_RE.test(f))
      .sort(naturalCompare)
    if (!files.length) continue
    result[slug] = files.map(f => ({
      type: VIDEO_RE.test(f) ? 'video' : 'image',
      src: `/assets/works/${slug}/${f}`,
    }))
  }
  return result
}

export default function caseItemsPlugin({ rootDir, outFile }) {
  const ROOT = path.resolve(rootDir)
  const OUT = path.resolve(outFile)

  function generate() {
    const items = buildItems(ROOT)
    const json = JSON.stringify(items, null, 2) + '\n'
    fs.mkdirSync(path.dirname(OUT), { recursive: true })
    let prev = ''
    try { prev = fs.readFileSync(OUT, 'utf-8') } catch { /* first run */ }
    if (prev !== json) fs.writeFileSync(OUT, json)
  }

  return {
    name: 'case-items-generator',
    buildStart() { generate() },
    configureServer(server) {
      generate()
      server.watcher.add(ROOT)
      const onChange = (file) => {
        if (file && file.startsWith(ROOT)) {
          generate()
          server.ws.send({ type: 'full-reload' })
        }
      }
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
      server.watcher.on('change', onChange)
    },
  }
}
