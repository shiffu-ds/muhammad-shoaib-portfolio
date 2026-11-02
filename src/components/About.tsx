import type { CSSProperties } from 'react'
import { portfolio } from '../content'
import { Section } from './Section'
import { ImagePlate } from './ui/ImagePlate'
import { Fill } from './ui/text'

export function About() {
  const { title, paragraphs, facts, principlesTitle, principles, portrait } = portfolio.about

  return (
    <Section id="about" index="02" label="About" title={title} className="band-reveal bg-band">
      <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <ImagePlate
            image={portrait}
            label="Portrait photo"
            ratio="4 / 5"
            sizes="(min-width: 64rem) 28vw, (min-width: 40rem) 24rem, 100vw"
            reveal
            className="group max-w-sm"
          />
          <dl
            data-reveal="up"
            style={{ '--delay': 250 } as CSSProperties}
            className="mt-8 max-w-sm divide-y divide-rule border-y border-rule"
          >
            {facts.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3">
                <dt className="pt-0.5 font-mono text-xs tracking-wider text-ink-3 uppercase">{fact.label}</dt>
                <dd className="text-[0.9375rem]">
                  <Fill text={fact.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div data-reveal="stagger" className="space-y-6 text-lg leading-relaxed sm:text-xl sm:leading-relaxed">
            {paragraphs.map((paragraph, i) => (
              <p key={i} style={{ '--i': i } as CSSProperties} className={i === 0 ? 'text-ink' : 'text-ink-2'}>
                <Fill text={paragraph} />
              </p>
            ))}
          </div>

          <h3 data-reveal="up" className="eyebrow mt-16">
            {principlesTitle}
          </h3>
          <ol data-reveal="stagger" className="mt-6">
            {principles.map((principle, i) => (
              <li
                key={principle.title}
                style={{ '--i': i } as CSSProperties}
                className="group grid grid-cols-[2.75rem_1fr] border-t border-rule py-6 transition-colors duration-500 hover:border-accent"
              >
                <span
                  aria-hidden="true"
                  className="pt-1.5 font-mono text-sm text-ink-3 transition-colors duration-500 group-hover:text-accent"
                >
                  0{i + 1}
                </span>
                <div className="transition-transform duration-500 ease-expo motion-safe:group-hover:translate-x-1.5">
                  <h4 className="font-display text-2xl leading-tight font-[420]">{principle.title}</h4>
                  <p className="mt-2 max-w-[52ch] text-ink-2">{principle.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
