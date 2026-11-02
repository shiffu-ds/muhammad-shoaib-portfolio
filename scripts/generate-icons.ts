// Builds the icon set from public/favicon.svg, and renders the 1200×630 link-preview card
// (public/og-image.png) from src/content.ts (name, avatar, field, positioning line) using
// headless Chrome or Chromium.
// Usage: npm run icons    (set CHROME_PATH if your browser is installed somewhere unusual)
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { extname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'
import { portfolio } from '../src/content.ts'
import { buildFigure, FIGURE } from '../src/lib/figure.ts'

const publicFile = (name: string) => fileURLToPath(new URL(`../public/${name}`, import.meta.url))
const moduleFile = (name: string) => fileURLToPath(new URL(`../node_modules/${name}`, import.meta.url))
const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const { person, site } = portfolio

// --- Icons -------------------------------------------------------------------
const svg = await readFile(publicFile('favicon.svg'), 'utf8')
const fullBleed = svg.replace('rx="8"', 'rx="0"') // home-screen icons get their corners rounded by the OS
const raster = (source: string, size: number) =>
  sharp(Buffer.from(source), { density: (72 * size) / 32 })
    .resize(size, size)
    .png()

await raster(fullBleed, 180).toFile(publicFile('apple-touch-icon.png'))
await raster(fullBleed, 192).toFile(publicFile('icon-192.png'))
await raster(fullBleed, 512).toFile(publicFile('icon-512.png'))

// favicon.ico wrapping a single 32×32 PNG, which the ICO format allows
const png = await raster(svg, 32).toBuffer()
const header = Buffer.alloc(22)
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(1, 4) // image count
header.writeUInt8(32, 6) // width
header.writeUInt8(32, 7) // height
header.writeUInt16LE(1, 10) // colour planes
header.writeUInt16LE(32, 12) // bits per pixel
header.writeUInt32LE(png.length, 14)
header.writeUInt32LE(22, 18) // offset of the image data
await writeFile(publicFile('favicon.ico'), Buffer.concat([header, png]))

const manifest = {
  name: `${person.name} — Portfolio`,
  short_name: person.name,
  icons: [
    // relative to the manifest, so they also work when the site lives under a sub-path
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
  theme_color: '#f3f0e8',
  background_color: '#f3f0e8',
  display: 'browser',
}
await writeFile(publicFile('site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log('icons: favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, site.webmanifest')

// --- Link-preview card ---------------------------------------------------------
const chrome = [
  process.env.CHROME_PATH,
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].find((path): path is string => Boolean(path) && existsSync(path!))

if (!chrome) {
  console.warn('og-image: no Chrome or Chromium found; set CHROME_PATH to regenerate public/og-image.png')
} else {
  const dir = await mkdtemp(join(tmpdir(), 'og-card-'))
  const page = join(dir, 'card.html')
  const shot = join(dir, 'card.png')
  await writeFile(page, await cardHtml())
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      '--virtual-time-budget=3000',
      `--screenshot=${shot}`,
      pathToFileURL(page).href,
    ],
    { stdio: 'ignore' },
  )
  await sharp(shot).resize(1200, 630).png({ compressionLevel: 9 }).toFile(publicFile('og-image.png'))
  await rm(dir, { recursive: true, force: true })
  console.log('og-image: public/og-image.png (1200×630)')
}

async function cardHtml() {
  const font = async (file: string) =>
    `data:font/woff2;base64,${(await readFile(moduleFile(file))).toString('base64')}`
  const [display, sans, mono] = await Promise.all([
    font('@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2'),
    font('@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2'),
    font('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2'),
  ])

  // The hero avatar, inlined like the fonts so the card needs nothing from outside
  const avatarFile = person.avatar?.src.startsWith('/') ? publicFile(person.avatar.src.slice(1)) : ''
  const avatarType = extname(avatarFile).slice(1).replace('jpg', 'jpeg').replace('svg', 'svg+xml')
  const avatar =
    avatarFile && existsSync(avatarFile)
      ? `<img class="avatar" alt="" src="data:image/${avatarType};base64,${(await readFile(avatarFile)).toString('base64')}">`
      : ''

  const at = person.statement.indexOf(person.highlight)
  const statement =
    at === -1
      ? escape(person.statement)
      : `${escape(person.statement.slice(0, at))}<mark>${escape(person.highlight)}</mark>${escape(
          person.statement.slice(at + person.highlight.length),
        )}`
  const footer = site.url ? new URL(site.url).host : 'Portfolio — selected work, experience & contact'

  const fig = buildFigure(7)
  const viridis = ['#482475', '#3e4a89', '#2d708e', '#20928c', '#28ae80', '#5ec962']
  const bottom = FIGURE.height - FIGURE.bottom
  const right = FIGURE.width - FIGURE.right
  const grid = fig.ticks
    .map(
      (t) =>
        `<line x1="${FIGURE.left}" x2="${right}" y1="${t.y}" y2="${t.y}"/><line x1="${t.x}" x2="${t.x}" y1="${FIGURE.top}" y2="${bottom}"/>`,
    )
    .join('')
  const dots = fig.dots
    .map((d) => `<circle cx="${d.cx.toFixed(1)}" cy="${d.cy.toFixed(1)}" r="3.6" fill="${viridis[d.bin]}"/>`)
    .join('')

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
@font-face { font-family: Display; src: url(${display}) format('woff2'); font-weight: 100 900; font-display: block; }
@font-face { font-family: Sans; src: url(${sans}) format('woff2'); font-weight: 100 700; font-display: block; }
@font-face { font-family: Mono; src: url(${mono}) format('woff2'); font-weight: 500; font-display: block; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { position: relative; display: grid; grid-template-columns: 1fr 410px; gap: 56px; align-items: center;
  padding: 0 80px 40px; background: #f3f0e8; color: #16181d; font-family: Sans; }
.eyebrow { display: flex; align-items: center; gap: 12px; font: 500 13px/1.3 Mono; letter-spacing: 0.07em; white-space: nowrap;
  text-transform: uppercase; color: #5c6068; }
.eyebrow::before { content: ''; width: 9px; height: 9px; border-radius: 50%; background: #0b6a65; }
.who { display: flex; align-items: center; gap: 24px; }
.avatar { width: 96px; height: 96px; margin-left: 7px; border-radius: 50%; object-fit: cover; border: 3px solid #faf8f3;
  box-shadow: 0 0 0 5px #f3f0e8, 0 0 0 6.5px rgb(11 106 101 / 0.45), 0 18px 32px -16px rgb(22 24 29 / 0.45); }
.avatar + .eyebrow::before { display: none; }
h1 { margin-top: 24px; font: 370 92px/0.92 Display; letter-spacing: -0.035em; }
p { margin-top: 24px; max-width: 16em; font: 360 31px/1.22 Display; letter-spacing: -0.01em; }
mark { color: inherit; background: linear-gradient(transparent 58%, #efd55c 58% 92%, transparent 92%); }
.plate { padding: 20px; border: 1px solid #d9d3c5; border-radius: 22px; background: #faf8f3; }
.plate svg { display: block; width: 100%; height: auto; }
footer { position: absolute; left: 80px; right: 80px; bottom: 44px; display: flex; justify-content: space-between;
  padding-top: 18px; border-top: 1px solid #d9d3c5; font: 500 15px/1 Mono; letter-spacing: 0.06em; color: #5c6068; }
</style></head>
<body>
  <div>
    <div class="who">${avatar}<div class="eyebrow">${escape(person.field)}</div></div>
    <h1>${escape(person.name)}</h1>
    <p>${statement}</p>
  </div>
  <div class="plate">
    <svg viewBox="0 0 ${FIGURE.width} ${FIGURE.height}">
      <defs><clipPath id="plot"><rect x="${fig.plot.x}" y="${fig.plot.y}" width="${fig.plot.width}" height="${fig.plot.height}"/></clipPath></defs>
      <g stroke="#d9d3c5" stroke-dasharray="2 4">${grid}</g>
      <path d="M${FIGURE.left} ${FIGURE.top}V${bottom}H${right}" fill="none" stroke="#5c6068"/>
      <g clip-path="url(#plot)">
        <path d="${fig.band}" fill="#0b6a65" fill-opacity="0.1"/>
        ${dots}
        <path d="${fig.curve}" fill="none" stroke="#16181d" stroke-width="2.25" stroke-linecap="round"/>
      </g>
    </svg>
  </div>
  <footer><span>${escape(footer)}</span><span>Fig. 0 — least-squares fit</span></footer>
</body></html>`
}
