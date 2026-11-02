import type { CSSProperties } from 'react'
import { portfolio } from '../content'
import { CONTACT_ITEM, NAV_ITEMS } from '../lib/sections'
import { ArrowUpIcon } from './ui/icons'
import { Logo } from './ui/Logo'
import { Letters, RollText } from './ui/text'

export function Footer() {
  const { name } = portfolio.person

  return (
    <footer id="footer" className="border-t border-rule">
      <div className="shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <p className="flex items-center gap-2.5">
          <Logo className="size-6" />
          <span className="font-display text-lg font-[500] tracking-[-0.01em]">{name}</span>
        </p>
        <nav aria-label="Footer">
          <ul className="-mx-2 flex flex-wrap">
            {[...NAV_ITEMS, CONTACT_ITEM].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="roll inline-flex min-h-11 items-center px-2 text-[0.9375rem] text-ink-2 transition-colors duration-200 hover:text-ink"
                >
                  <RollText text={item.label} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="#top"
          className="group inline-flex min-h-11 items-center gap-2 self-start text-[0.9375rem] font-medium md:self-auto"
        >
          Back to top
          <ArrowUpIcon className="size-4 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5" />
        </a>
      </div>
      {/* The name, set huge; its letters rise in as the page ends. The small one above is the real text. */}
      <div aria-hidden="true" className="wordmark-box shell overflow-hidden">
        <p
          data-reveal="chars"
          style={{ '--chars': name.length } as CSSProperties}
          className="wordmark font-display leading-none font-[380] tracking-[-0.045em] whitespace-nowrap">
          <Letters text={name} />
        </p>
      </div>
      <div className="shell">
        <div className="flex flex-col gap-1 border-t border-rule py-6 text-sm text-ink-3 sm:flex-row sm:justify-between">
          <p>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {name}
          </p>
          <p>Set in Fraunces and IBM Plex. Built with React and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  )
}
