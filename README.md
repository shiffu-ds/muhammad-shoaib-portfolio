# Muhammad Shoaib — portfolio

A one-page portfolio for data, machine learning and AI work, built with React 19, TypeScript, Tailwind CSS 4 and Vite. The page is pre-rendered at build time, so it loads fast, reads well without JavaScript and gives search engines and link previews real content.

## Run it

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev        # http://localhost:5173, reloads as you edit
npm run build      # type-check, build and pre-render into dist/
npm run preview    # serve the production build at http://localhost:4173
```

## Edit your content

Everything the site says lives in **`src/content.ts`**: your name, intro, projects, experience, skills, links and images.

- **`[Square brackets]` mark a placeholder.** It shows on the page with a dotted underline. Replace it with your own words and remove the brackets.
- **`DRAFT` comments mark starter copy** written for a data/ML profile (the line under your name, the "How I work" principles, section intros, the contact heading). Rewrite anything that doesn't sound like you.
- **Links only appear once they have a real destination.** An empty `''` hides a project's live/code link, a social profile or the résumé button. Nothing on the page points nowhere.
- Run **`npm run check:content`** to list every placeholder, hidden link and missing image that's left. Add `-- --strict` to make it fail while anything remains (useful before deploying).

### Images

Projects and the About section show labelled placeholders until you add images.

```bash
npm run images -- ~/Pictures/churn-dashboard.png
```

This writes 800px and 1600px WebP versions to `public/images/` and prints an `image: { … }` entry. Paste it into the project (or `about.portrait`) in `src/content.ts`, then write a real `alt` description. Images keep their space reserved while loading and are lazy-loaded.

### Résumé

Put the PDF at `public/resume.pdf` and set `resumeUrl: '/resume.pdf'`. A "Download résumé" button then appears in the hero and the contact section. A full URL (e.g. a Google Drive link) shows "View résumé" instead.

### Your live address

Once you know your domain, set `site.url` (e.g. `'https://mohdshoaib.dev'`). Link previews on LinkedIn, Slack and X need it for the preview image, and the build reminds you until it's set.

## Icons and link preview

`public/favicon.svg` is the source for every icon. `npm run icons` regenerates `favicon.ico`, the Apple/Android icons, `site.webmanifest` and the 1200×630 `og-image.png` link-preview card, which is drawn from your name, avatar, field and positioning line in `src/content.ts`. The preview card needs Chrome or Chromium installed; set `CHROME_PATH` if it isn't found automatically. Re-run it after changing those lines.

## Deploy

`npm run build` produces a static site in `dist/` that any static host can serve.

### Render (free static site)

`render.yaml` already describes the site (Node from `.node-version`, build `npm ci && npm run build`, publish `dist`, long-term caching for hashed assets).

1. Push this folder to a GitHub repository.
2. In the [Render dashboard](https://dashboard.render.com): **New → Blueprint**, connect GitHub, pick the repository, and click **Apply**. (Or **New → Static Site** with build command `npm ci && npm run build` and publish directory `dist`.)
3. When the first deploy finishes, copy the address (e.g. `https://muhammad-shoaib-portfolio.onrender.com`) into `site.url` in `src/content.ts`, run `npm run icons`, then commit and push. Render redeploys on every push, and link previews start working.

### Other hosts

- **Netlify / Vercel / Cloudflare Pages:** build command `npm run build`, output directory `dist`.
- **GitHub Pages:** serve `dist/`. If the site lives under a sub-path (e.g. `username.github.io/portfolio/`), add `base: '/portfolio/'` to `vite.config.ts`.

There's no contact form: the contact section uses your email address (a `mailto:` link plus a copy button), so nothing pretends to send a message.

## How it's put together

```
src/
  content.ts          ← all editable content
  types.ts            ← the shape of that content
  App.tsx             ← page order
  components/         ← Header, Hero, HeroFigure, Work, ProjectCase, About, Experience, Contact, Footer
  components/ui/      ← buttons, links, image plate, placeholder-aware text, icons, logo
  lib/                ← placeholder + link checks, theme and scroll hooks, the hero figure's maths
  index.css           ← design tokens (colours, type, motion) and a few custom styles
scripts/
  head.ts             ← writes <title>, meta, social and icon tags from content.ts
  prerender.ts        ← bakes the rendered page into dist/index.html
  check-content.ts, optimize-images.ts, generate-icons.ts
```

- **Design:** warm paper and ink with one teal accent and a highlighter yellow. Fraunces for display type, IBM Plex Sans and Mono for text and data labels. The hero figure is a real least-squares fit computed in the browser, coloured with the viridis palette. Light and dark themes follow the system setting, and the header button overrides it; the choice is remembered.
- **Motion:** your name rises in letter by letter, labels decode from random glyphs, and sections reveal as they scroll into view. The header tucks away while you scroll down and returns when you scroll up, and the nav underline slides between sections. Case studies unfold step by step, and the theme switch grows out of the toggle as a circle. Visitors can point at the chart to read the fitted value or resample it. A floating button and a bar under the header track scroll progress. A band of your field names drifts between the hero and the work, and a giant outlined name rises into the footer.
  - Scroll-linked touches (in browsers that support CSS scroll-driven animations): the hero eases back as you leave it, case numbers drift, the About band opens out to full width, the contact panel scales in and an accent line fills the timeline as you read. Other browsers simply skip them.
  - For mouse users only: a ring trails the pointer, buttons with `data-magnetic` lean toward it, project plates (`data-tilt`) tilt in 3D with a glare, and `data-spotlight` areas get a glow that follows it (see `src/components/MotionLayer.tsx`). A project result like `94%` counts up when it scrolls into view.
  - To animate something new, give it `data-reveal="up"` (fade up), `"stagger"` (its children one by one, using `--i`), `"words"` (with `<Words>`), `"chars"` (with `<Letters>`) or `"line"`. The small observer in `index.html` does the rest.
  - Everything is static when the visitor's system asks for reduced motion, and nothing is hidden when JavaScript is off.
- **Accessibility:** semantic landmarks and headings, a skip link, visible focus rings, keyboard-operable menu and case studies (Escape closes the menu), 44px touch targets, and colour contrast that passes WCAG AA in both themes.
- Build scripts run with [`tsx`](https://tsx.is), so they work on every Node install, including distro builds without built-in TypeScript support.
