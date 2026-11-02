import { useState, type CSSProperties } from 'react'
import { hasDestination } from '../lib/placeholder'
import type { Link, Project } from '../types'
import { buttonClass } from './ui/button'
import { ChevronDownIcon } from './ui/icons'
import { ImagePlate } from './ui/ImagePlate'
import { CountUp } from './ui/animated'
import { TextLink } from './ui/links'
import { Chips, Fill } from './ui/text'

const STEPS = [
  ['problem', 'The problem'],
  ['contribution', 'My contribution'],
  ['approach', 'Approach'],
  ['outcome', 'Outcome'],
] as const

export function ProjectCase({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false)
  const number = String(index + 1).padStart(2, '0')
  const id = `case-${number}`
  const flipped = index % 2 === 1
  const links: Link[] = [
    { label: 'Live demo', url: project.liveUrl },
    { label: 'Source code', url: project.repoUrl },
    ...(project.links ?? []),
  ].filter((link) => hasDestination(link.url))

  return (
    <article aria-labelledby={`${id}-title`} className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
      <figure
        data-reveal="up"
        className={`group lg:col-span-7 lg:row-start-1 ${flipped ? 'lg:col-start-6' : 'lg:col-start-1'}`}
      >
        <ImagePlate
          image={project.image}
          label={`Project ${number}: screenshot, chart or diagram`}
          ratio="16 / 10"
          sizes="(min-width: 64rem) 56vw, 100vw"
          interactive
        />
        <figcaption className="mt-3 font-mono text-xs text-ink-3">
          Fig. {index + 1} — <Fill text={project.title} />
        </figcaption>
      </figure>

      <div
        data-reveal="up"
        style={{ '--delay': 150 } as CSSProperties}
        className={`relative isolate flex flex-col lg:col-span-5 lg:row-start-1 lg:self-center ${flipped ? 'lg:col-start-1' : 'lg:col-start-8'}`}
      >
        {/* A big outlined number that drifts against the scroll */}
        <span
          aria-hidden="true"
          className="case-number pointer-events-none absolute top-0 right-0 -z-10 font-display text-[clamp(6rem,12vw,10rem)] leading-none font-[400] tracking-[-0.04em] select-none lg:-top-20"
        >
          {number}
        </span>
        <p className="eyebrow">
          Case {number} · <Fill text={project.year} />
        </p>
        <h3
          id={`${id}-title`}
          className="mt-4 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.08] font-[400] tracking-[-0.015em]"
        >
          <Fill text={project.title} />
        </h3>
        <p className="mt-4 text-lg text-ink-2">
          <Fill text={project.summary} />
        </p>

        <div className="mt-6 border-l-2 border-accent pl-4">
          <p className="font-display text-4xl leading-none font-[420]">
            <CountUp text={project.result.value} />
          </p>
          <p className="mt-2 font-mono text-xs tracking-wider text-ink-3 uppercase">
            <Fill text={project.result.label} />
          </p>
        </div>

        <dl className="mt-6 grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3 border-t border-rule pt-5 text-[0.9375rem]">
          <dt className="pt-0.5 font-mono text-xs tracking-wider text-ink-3 uppercase">Role</dt>
          <dd>
            <Fill text={project.role} />
          </dd>
          <dt className="pt-1 font-mono text-xs tracking-wider text-ink-3 uppercase">Stack</dt>
          <dd>
            <Chips items={project.tools} />
          </dd>
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={`${id}-details`}
            className={buttonClass('secondary', open ? 'border-ink bg-surface' : '')}
          >
            {open ? 'Hide case study' : 'Read case study'}
            <ChevronDownIcon
              className={`size-4 transition-transform duration-500 ease-expo ${open ? 'rotate-180' : ''}`}
            />
          </button>
          {links.map((link) => (
            <TextLink key={link.label} href={link.url} className="link inline-flex min-h-11 items-center gap-1 font-medium">
              {link.label}
            </TextLink>
          ))}
        </div>
      </div>

      <div
        id={`${id}-details`}
        inert={!open}
        data-open={open}
        className={`grid transition-[grid-template-rows] duration-700 ease-expo lg:col-span-12 ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-x-10 gap-y-8 border-t border-rule pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([key, label], i) => (
              <section
                key={key}
                aria-labelledby={`${id}-${key}`}
                style={{ '--i': i } as CSSProperties}
                className="case-step"
              >
                <h4 id={`${id}-${key}`} className="eyebrow">
                  <span className="text-accent">0{i + 1}</span> {label}
                </h4>
                <p className="mt-3 text-ink-2">
                  <Fill text={project[key]} />
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
