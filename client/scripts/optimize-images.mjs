import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

// Recompresses raster assets. Takes the files to process as arguments; with no
// arguments it walks every image under public/assets, which is the fallback for
// when the caller cannot work out what changed.
//
// PNG is re-encoded losslessly, so running it twice costs nothing but time.
// JPEG is not, and a re-encode that shaves a handful of bytes would rewrite the
// file and spend a generation of quality to do it — hence MIN_GAIN, which only
// accepts a result that is meaningfully smaller. In practice an already-encoded
// JPEG comes back slightly *larger*, so this rarely triggers, but the guard is
// the thing that makes that safe rather than lucky.

const ASSETS = 'public/assets'
const MIN_GAIN = 0.02

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

async function optimize(file) {
  const ext = path.extname(file).toLowerCase()
  const before = fs.statSync(file).size
  let buf

  if (ext === '.png') {
    buf = await sharp(file).png({ compressionLevel: 9 }).toBuffer()
  } else if (ext === '.jpg' || ext === '.jpeg') {
    buf = await sharp(file).jpeg({ quality: 85 }).toBuffer()
  } else {
    return null
  }

  const gain = 1 - buf.length / before
  if (gain < MIN_GAIN) return { file, before, skipped: true, gain }
  fs.writeFileSync(file, buf)
  return { file, before, after: buf.length, gain }
}

const requested = process.argv.slice(2)
const files = (requested.length ? requested : walk(ASSETS))
  .filter((f) => /\.(png|jpe?g)$/i.test(f))
  .filter((f) => fs.existsSync(f))

if (files.length === 0) {
  console.log('No images to process.')
  process.exit(0)
}

let written = 0
let saved = 0
for (const file of files) {
  const r = await optimize(file)
  if (!r) continue
  if (r.skipped) {
    console.log(`skip     ${r.file} (best gain ${(r.gain * 100).toFixed(1)}%, under ${MIN_GAIN * 100}%)`)
    continue
  }
  written++
  saved += r.before - r.after
  console.log(`optimize ${r.file} ${r.before} -> ${r.after} (-${(r.gain * 100).toFixed(1)}%)`)
}
console.log(`\n${files.length} checked, ${written} rewritten, ${(saved / 1024).toFixed(0)} KB saved`)
