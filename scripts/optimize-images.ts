// Resizes photos and screenshots into web-ready WebP files in public/images/ and prints
// the `image` entry to paste into src/content.ts.
// Usage: npm run images -- path/to/screenshot.png [more files…]
import { mkdir } from 'node:fs/promises'
import { basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const WIDTHS = [800, 1600]
const outDir = new URL('../public/images/', import.meta.url)
const files = process.argv.slice(2)

if (files.length === 0) {
  console.log('Usage: npm run images -- path/to/image.jpg [more files…]')
  process.exit(1)
}

await mkdir(outDir, { recursive: true })

for (const file of files) {
  const name = basename(file, extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const { width: original = 0 } = await sharp(file).rotate().metadata()
  const widths = [...new Set(WIDTHS.map((w) => Math.min(w, original)))]

  const outputs = []
  for (const width of widths) {
    const output = `${name}-${width}.webp`
    const info = await sharp(file)
      .rotate() // respect camera orientation
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(fileURLToPath(new URL(output, outDir)))
    outputs.push({ src: `/images/${output}`, width: info.width, height: info.height, bytes: info.size })
  }

  const largest = outputs[outputs.length - 1]
  console.log(`\n${file} → ${outputs.map((o) => `${o.src} (${Math.round(o.bytes / 1024)} KB)`).join(', ')}`)
  console.log(`image: {
  src: '${largest.src}',${outputs.length > 1 ? `\n  srcSet: '${outputs.map((o) => `${o.src} ${o.width}w`).join(', ')}',` : ''}
  width: ${largest.width},
  height: ${largest.height},
  alt: 'Describe what the image shows',
},`)
}
