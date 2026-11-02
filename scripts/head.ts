import type { Plugin } from 'vite'
import { portfolio } from '../src/content.ts'
import { hasDestination } from '../src/lib/placeholder.ts'

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Fills the <!--app-head--> marker in index.html with title, social-card and icon tags from src/content.ts. */
export function headTags(): Plugin {
  return {
    name: 'portfolio-head',
    configResolved(config) {
      if (config.command === 'build' && !config.build.ssr && !portfolio.site.url) {
        config.logger.warn(
          '\n[portfolio] site.url is empty in src/content.ts — set it so link previews get an absolute image URL.\n',
        )
      }
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replace('<!--app-head-->', renderHead()),
    },
  }
}

function siteBase(url: string) {
  if (!url) return ''
  try {
    const href = new URL(url).href
    return href.endsWith('/') ? href : `${href}/`
  } catch {
    throw new Error(`site.url "${url}" in src/content.ts must be a full address, e.g. https://example.com`)
  }
}

function renderHead() {
  const { site, person } = portfolio
  const base = siteBase(site.url)
  // Resolve against the site address, keeping any sub-path (e.g. https://name.github.io/portfolio/)
  const absolute = (path: string) => (base ? new URL(path.replace(/^\//, ''), base).href : path)
  const meta = (attribute: 'name' | 'property', key: string, content: string) =>
    `<meta ${attribute}="${key}" content="${escape(content)}" />`

  const profiles = person.socials.map((social) => social.url).filter(hasDestination)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    email: `mailto:${person.email}`,
    ...(base && { url: base }),
    ...(profiles.length > 0 && { sameAs: profiles }),
  }

  return [
    `<title>${escape(site.title)}</title>`,
    meta('name', 'description', site.description),
    meta('name', 'author', person.name),
    base && `<link rel="canonical" href="${escape(base)}" />`,
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', person.name),
    meta('property', 'og:title', site.title),
    meta('property', 'og:description', site.description),
    base && meta('property', 'og:url', base),
    meta('property', 'og:image', absolute(site.ogImage)),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', site.ogImageAlt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', site.title),
    meta('name', 'twitter:description', site.description),
    meta('name', 'twitter:image', absolute(site.ogImage)),
    '<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f3f0e8" />',
    '<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0e1012" />',
    '<link rel="icon" href="/favicon.ico" sizes="32x32" />',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml" />',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
    '<link rel="manifest" href="/site.webmanifest" />',
    `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')
}
