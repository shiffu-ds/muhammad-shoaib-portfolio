/** The shape of everything in src/content.ts. */

export type Image = {
  /** A path inside /public (e.g. '/images/churn-1600.webp') or a full URL. */
  src: string
  /** What the image shows, for people using screen readers. */
  alt: string
  /** Intrinsic size in pixels. It reserves space so the page doesn't jump while loading. */
  width: number
  height: number
  /** Optional responsive sources, e.g. '/images/a-800.webp 800w, /images/a-1600.webp 1600w'. */
  srcSet?: string
}

export type Link = {
  label: string
  /** Leave as '' to hide the link. */
  url: string
}

export type Project = {
  title: string
  summary: string
  year: string
  role: string
  tools: string[]
  /** The one number or fact a reader should remember. */
  result: { value: string; label: string }
  problem: string
  contribution: string
  approach: string
  outcome: string
  image?: Image
  liveUrl: string
  repoUrl: string
  /** Anything else worth linking: paper, notebook, dataset, write-up… */
  links?: Link[]
}

export type Role = {
  period: string
  title: string
  org: string
  summary: string
  highlights: string[]
}

export type Study = {
  period: string
  credential: string
  institution: string
  detail: string
}

export type SkillGroup = { area: string; items: string[] }

export type Principle = { title: string; body: string }

export type Fact = { label: string; value: string }

export type Portfolio = {
  site: {
    url: string
    title: string
    description: string
    ogImage: string
    ogImageAlt: string
  }
  person: {
    name: string
    /** Small round photo beside your field in the hero. Square works best. */
    avatar?: Image
    field: string
    statement: string
    highlight: string
    intro: string
    availability: string
    location: string
    email: string
    resumeUrl: string
    socials: Link[]
  }
  work: { title: string; intro: string; projects: Project[] }
  about: {
    title: string
    paragraphs: string[]
    facts: Fact[]
    principlesTitle: string
    principles: Principle[]
    portrait?: Image
  }
  experience: {
    title: string
    intro: string
    roles: Role[]
    education: Study[]
    skills: SkillGroup[]
  }
  contact: { title: string; highlight: string; body: string }
}
