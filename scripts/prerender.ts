// Bakes the rendered page into dist/index.html, so content appears before JavaScript
// loads (and without it). Runs after both Vite builds; see "build" in package.json.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const path = (relative: string) => fileURLToPath(new URL(`../${relative}`, import.meta.url))

const entry = new URL('../dist-ssr/entry-server.js', import.meta.url).href
const { render } = (await import(entry)) as { render: () => string }

const htmlFile = path('dist/index.html')
const html = await readFile(htmlFile, 'utf8')
const root = '<div id="root"></div>'
if (!html.includes(root)) throw new Error(`prerender: ${root} not found in dist/index.html`)

// Preload the Latin subsets of the two typefaces on the first screen.
const assetBase = /(?:src|href)="([^"]*?)assets\//.exec(html)?.[1] ?? '/'
const preloads = (await readdir(path('dist/assets')))
  .filter((file) => /^(fraunces-latin-opsz-normal|ibm-plex-sans-latin-wght-normal)-.+\.woff2$/.test(file))
  .map((file) => `<link rel="preload" href="${assetBase}assets/${file}" as="font" type="font/woff2" crossorigin />`)

await writeFile(
  htmlFile,
  html.replace('</title>', ['</title>', ...preloads].join('\n    ')).replace(root, `<div id="root">${render()}</div>`),
)
await rm(path('dist-ssr'), { recursive: true, force: true })
console.log(`prerender: dist/index.html now has static markup and ${preloads.length} font preloads`)
