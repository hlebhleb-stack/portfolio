import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ASSET_RE = /\.(mp4|png|jpg|jpeg|webp)$/i
const VIDEO_RE = /\.mp4$/i

// Emits the intrinsic pixel size of every case-page media file, keyed by the
// URL the markup requests it at.
//
// Case media is laid out with `width: 100%` and no height, so until a file's
// header arrived its container measured zero and the page grew by the item's
// full height the moment it did. With nineteen of them on the Colb case, fast
// scrolling meant a burst of those, each one dirtying layout that the
// scroll-spy then re-read on the same frame. Knowing the ratio up front lets
// the container reserve its space before anything loads, so nothing reflows.
//
// The same numbers give ColbMedia's two-column masonry a real height to
// balance on, which is what its comment always claimed it did — the `ratio`
// field it read had never actually been produced.

// Width and height live in the track header box (moov > trak > tkhd) as
// 16.16 fixed-point display dimensions, which already account for the display
// matrix. The audio track reports 0x0, so the video track is whichever one
// reports a non-zero size. Parsed here rather than shelling out to ffprobe to
// keep the build free of a binary dependency.
function mp4Dimensions(file) {
  const buf = fs.readFileSync(file)
  let best = null

  const walk = (start, end) => {
    let off = start
    while (off + 8 <= end) {
      let size = buf.readUInt32BE(off)
      const type = buf.toString('latin1', off + 4, off + 8)
      let header = 8
      if (size === 1) {
        size = Number(buf.readBigUInt64BE(off + 8))
        header = 16
      } else if (size === 0) {
        size = end - off
      }
      if (size < header || off + size > end) break
      if (type === 'moov' || type === 'trak' || type === 'mdia') {
        walk(off + header, off + size)
      } else if (type === 'tkhd') {
        const p = off + header
        const at = buf[p] === 1 ? p + 88 : p + 76
        if (at + 8 <= off + size) {
          const w = buf.readUInt32BE(at) / 65536
          const h = buf.readUInt32BE(at + 4) / 65536
          if (w > 0 && h > 0) best = [Math.round(w), Math.round(h)]
        }
      }
      off += size
    }
  }

  try {
    walk(0, buf.length)
  } catch {
    return null
  }
  return best
}

async function imageDimensions(file) {
  try {
    const { width, height } = await sharp(file).metadata()
    return width && height ? [width, height] : null
  } catch {
    return null
  }
}

function walkDir(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walkDir(full))
    else if (ASSET_RE.test(entry.name)) out.push(full)
  }
  return out
}

async function buildSizes(rootDir) {
  if (!fs.existsSync(rootDir)) return {}
  const result = {}
  for (const file of walkDir(rootDir).sort()) {
    const size = VIDEO_RE.test(file) ? mp4Dimensions(file) : await imageDimensions(file)
    if (!size) continue
    const rel = path.relative(rootDir, file).split(path.sep).join('/')
    result[`/assets/works/${rel}`] = size
  }
  return result
}

export default function caseItemsPlugin({ rootDir, outFile }) {
  const ROOT = path.resolve(rootDir)
  const OUT = path.resolve(outFile)

  async function generate() {
    const sizes = await buildSizes(ROOT)
    const json = JSON.stringify(sizes, null, 2) + '\n'
    fs.mkdirSync(path.dirname(OUT), { recursive: true })
    let prev = ''
    try { prev = fs.readFileSync(OUT, 'utf-8') } catch { /* first run */ }
    if (prev !== json) fs.writeFileSync(OUT, json)
  }

  return {
    name: 'case-media-sizes',
    async buildStart() { await generate() },
    async configureServer(server) {
      await generate()
      server.watcher.add(ROOT)
      const onChange = async (file) => {
        if (file && file.startsWith(ROOT)) {
          await generate()
          server.ws.send({ type: 'full-reload' })
        }
      }
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
      server.watcher.on('change', onChange)
    },
  }
}
