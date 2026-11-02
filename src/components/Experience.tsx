import type { CSSProperties, ReactNode } from 'react'
import { portfolio } from '../content'
import { Section } from './Section'
import { Chips, Fill } from './ui/text'

/** One entry on the timeline: the period on the left, a dot on the rule, details on the right. */
function TimelineItem({ index, period, children }: { index: number; period: string; children: ReactNode }) {
  return (
    <li
      style={{ '--i': index } as CSSProperties}
      className="grid gap-x-10 gap-y-1 pb-12 last:pb-0 sm:grid-cols-[8.5rem_1fr]"
    >
      <p className="pt-1 pl-7 font-mono text-[0.8125rem] text-ink-3 tabular-nums sm:pl-0 sm:text-right">
        <Fill text={period} />
      </p>
      <div className="relative pl-7">
        <span aria-hidden="true" className="timeline-dot" />
        {children}
      </div>
    </li>
  )
}

export function Experience() {
  const { title, intro, roles, education, skills } = portfolio.experience

  return (
    <Section id="experience" index="03" label="Experience" title={title} intro={intro}>
      <div className="grid gap-x-16 gap-y-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h3 data-reveal="up" className="eyebrow">
            Experience
          </h3>
          <ol data-reveal="stagger" className="timeline mt-8">
            {roles.map((role, i) => (
              <TimelineItem key={i} index={i} period={role.period}>
                <h4 className="font-display text-2xl leading-tight font-[420]">
                  <Fill text={role.title} />
                </h4>
                <p className="mt-1 font-medium text-ink-2">
                  <Fill text={role.org} />
                </p>
                {role.summary && (
                  <p className="mt-3 text-ink-2">
                    <Fill text={role.summary} />
                  </p>
                )}
                {role.highlights.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {role.highlights.map((item, j) => (
                      <li
                        key={j}
                        className="relative pl-5 text-ink-2 before:absolute before:top-[0.8em] before:left-0 before:h-px before:w-2.5 before:bg-accent"
                      >
                        <Fill text={item} />
                      </li>
                    ))}
                  </ul>
                )}
              </TimelineItem>
            ))}
          </ol>

          <h3 data-reveal="up" className="eyebrow mt-16">
            Education
          </h3>
          <ol data-reveal="stagger" className="timeline mt-8">
            {education.map((study, i) => (
              <TimelineItem key={i} index={i} period={study.period}>
                <h4 className="font-display text-2xl leading-tight font-[420]">
                  <Fill text={study.credential} />
                </h4>
                <p className="mt-1 font-medium text-ink-2">
                  <Fill text={study.institution} />
                </p>
                <p className="mt-3 text-ink-2">
                  <Fill text={study.detail} />
                </p>
              </TimelineItem>
            ))}
          </ol>
        </div>

        <div data-reveal="up" className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <h3 className="eyebrow">Table 1 — Toolkit</h3>
          <dl className="mt-5 border-y-2 border-ink">
            {skills.map((group) => (
              <div key={group.area} className="border-b border-rule py-5 last:border-b-0">
                <dt className="font-medium">{group.area}</dt>
                <dd className="mt-3">
                  <Chips items={group.items} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  )
}
