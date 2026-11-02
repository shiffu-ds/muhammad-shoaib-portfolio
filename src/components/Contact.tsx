import type { CSSProperties } from 'react'
import { portfolio } from '../content'
import { hasDestination, isEmail } from '../lib/placeholder'
import { Scramble } from './ui/animated'
import { CopyButton } from './ui/CopyButton'
import { ArrowUpRightIcon } from './ui/icons'
import { ResumeLink, TextLink } from './ui/links'
import { Fill, Words } from './ui/text'

export function Contact() {
  const { title, highlight, body } = portfolio.contact
  const { email, socials, resumeUrl } = portfolio.person
  const profiles = socials.filter((social) => hasDestination(social.url))

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-16 sm:py-24">
      <div className="shell">
        <div
          data-spotlight
          className="contact-panel panel-dark relative isolate overflow-hidden rounded-[1.75rem] border border-rule px-6 py-14 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
          <div
            aria-hidden="true"
            style={{ '--glow-at': '88% 100%', '--fade-at': '85% 95%' } as CSSProperties}
            className="backdrop pointer-events-none absolute inset-0 -z-10"
          />
          <div aria-hidden="true" className="spotlight pointer-events-none absolute inset-0 -z-10" />
          <div aria-hidden="true" className="flex items-center gap-4">
            <span className="eyebrow text-accent">04</span>
            <Scramble text="Contact" className="eyebrow" />
            <span data-reveal="line" className="h-px flex-1 origin-left bg-rule" />
          </div>
          <h2
            id="contact-title"
            data-reveal="words"
            className="mt-8 max-w-[15ch] font-display text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.98] font-[370] tracking-[-0.03em]"
          >
            <Words text={title} highlight={highlight} />
          </h2>

          <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-12">
            <div data-reveal="up" className="lg:col-span-7">
              <p className="max-w-[48ch] text-lg text-ink-2">{body}</p>
              {isEmail(email) ? (
                <>
                  <a
                    href={`mailto:${email}`}
                    data-magnetic="0.08"
                    className="group mt-8 transition-transform duration-500 ease-expo inline-flex min-h-11 max-w-full items-center gap-3 font-display text-[clamp(1.125rem,4.6vw,2.25rem)] leading-tight font-[400] tracking-[-0.01em] lg:text-[clamp(1.5rem,2.3vw,2.25rem)]"
                  >
                    {/* If it must wrap, break after the @ rather than mid-word */}
                    <span className="link min-w-0 [overflow-wrap:anywhere]">
                      {email.split('@')[0]}@<wbr />
                      {email.split('@')[1]}
                    </span>
                    <ArrowUpRightIcon className="size-[0.8em] shrink-0 text-accent transition-transform duration-500 ease-expo motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1" />
                  </a>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <CopyButton value={email} label="Copy email" />
                    {hasDestination(resumeUrl) && <ResumeLink url={resumeUrl} />}
                  </div>
                </>
              ) : (
                <p className="mt-8 text-lg">
                  <Fill text="[Add your email address to person.email in src/content.ts]" />
                </p>
              )}
            </div>

            <div data-reveal="up" style={{ '--delay': 150 } as CSSProperties} className="lg:col-span-4 lg:col-start-9">
              <h3 className="eyebrow">Elsewhere</h3>
              {profiles.length > 0 ? (
                <ul className="mt-4 border-t border-rule">
                  {profiles.map((profile) => (
                    <li key={profile.label} className="border-b border-rule">
                      <TextLink
                        href={profile.url}
                        className="flex min-h-14 items-center justify-between gap-4 text-lg transition-[color,padding] duration-300 hover:pl-1 hover:text-accent"
                      >
                        {profile.label}
                      </TextLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 border-t border-rule pt-4 text-ink-2">
                  <Fill text="[Your LinkedIn, GitHub and Kaggle links appear here once you add them]" />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
