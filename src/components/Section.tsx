import type { CSSProperties, ReactNode } from 'react'
import { Scramble } from './ui/animated'
import { Words } from './ui/text'

type Props = {
  id: string
  index: string
  label: string
  title: string
  intro?: string
  className?: string
  children: ReactNode
}

/** A numbered page section: a label row whose rule draws in, then a heading that rises word by word. */
export function Section({ id, index, label, title, intro, className = '', children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={className}>
      <div className="shell py-20 sm:py-28 lg:py-32">
        <header className="mb-12 sm:mb-16 lg:mb-20">
          <div aria-hidden="true" className="flex items-center gap-4">
            <span className="eyebrow text-accent">{index}</span>
            <Scramble text={label} className="eyebrow" />
            <span data-reveal="line" className="h-px flex-1 origin-left bg-rule" />
          </div>
          <div className="mt-8 grid gap-x-10 gap-y-5 lg:grid-cols-12">
            <h2
              id={`${id}-title`}
              data-reveal="words"
              className="font-display text-[clamp(2.25rem,5.2vw,4rem)] leading-[1.02] font-[380] tracking-[-0.025em] lg:col-span-7"
            >
              <Words text={title} />
            </h2>
            {intro ? (
              <p
                data-reveal="up"
                style={{ '--delay': 200 } as CSSProperties}
                className="max-w-[46ch] text-ink-2 lg:col-span-4 lg:col-start-9 lg:self-end"
              >
                {intro}
              </p>
            ) : null}
          </div>
        </header>
        {children}
      </div>
    </section>
  )
}
