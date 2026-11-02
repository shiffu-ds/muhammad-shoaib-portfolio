// Lists what is still unfinished in src/content.ts: placeholder text, hidden links,
// missing images and local files that don't exist. Usage: npm run check:content
// Add `-- --strict` to exit with an error while anything is left (handy in CI).
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { portfolio } from '../src/content.ts'
import { hasDestination, isPlaceholder } from '../src/lib/placeholder.ts'

const placeholders: string[] = []
const hiddenLinks: string[] = []
const missingFiles: string[] = []

const isLinkField = (key: string) => key === 'url' || key.endsWith('Url') || key === 'src'
const inPublic = (path: string) => existsSync(fileURLToPath(new URL(`../public${path}`, import.meta.url)))

function walk(value: unknown, path: string, key: string) {
  if (typeof value === 'string') {
    if (isPlaceholder(value)) placeholders.push(`${path}  ${value}`)
    else if (isLinkField(key) && path !== 'site.url') {
      if (!hasDestination(value)) hiddenLinks.push(path)
      else if (value.startsWith('/') && !inPublic(value)) missingFiles.push(`${path}  ${value}`)
    }
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, `${path}[${i}]`, key))
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k, k)
  }
}

walk(portfolio, '', '')

const missingImages = [
  ...portfolio.work.projects.flatMap((project, i) => (project.image ? [] : [`work.projects[${i}].image`])),
  ...(portfolio.about.portrait ? [] : ['about.portrait']),
]
const siteNotes = portfolio.site.url ? [] : ['site.url is empty: link previews need the live address']
if (!inPublic(portfolio.site.ogImage)) siteNotes.push(`site.ogImage ${portfolio.site.ogImage} is missing from /public`)

const report = (title: string, lines: string[]) =>
  console.log(`\n${title} (${lines.length})\n${lines.length ? lines.map((line) => `  • ${line}`).join('\n') : '  none'}`)

report('Placeholder text to replace', placeholders)
report('Links hidden until a URL is set', hiddenLinks)
report('Image placeholders (no image set)', missingImages)
report('Local files that do not exist in /public', missingFiles)
report('Site settings', siteNotes)

const remaining = placeholders.length + hiddenLinks.length + missingImages.length + missingFiles.length + siteNotes.length
console.log(remaining ? `\n${remaining} item(s) left.` : '\nAll content is filled in.')
if (remaining && process.argv.includes('--strict')) process.exit(1)
