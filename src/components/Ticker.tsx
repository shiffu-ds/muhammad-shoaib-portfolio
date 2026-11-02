import { portfolio } from '../content'

/**
 * A slow band of the field names scrolling between the hero and the work. Decorative (the
 * same words are in the hero), so it's hidden from screen readers; it holds still for
 * reduced motion and pauses under the pointer.
 */
export function Ticker() {
  const words = portfolio.person.field.split('·').map((word) => word.trim())
  // Each half has to be wider than the screen for the loop to be seamless.
  const run = Array.from({ length: 4 }, () => words).flat()

  return (
    <div aria-hidden="true" className="ticker border-y border-rule bg-surface/60 py-5 sm:py-7 print:hidden">
      <div className="ticker-track">
        {[0, 1].map((half) => (
          <ul key={half} className="flex shrink-0 items-center">
            {run.map((word, i) => (
              <li
                key={i}
                className="flex items-center font-display text-[clamp(1.75rem,4.5vw,3.5rem)] leading-none font-[360] tracking-[-0.02em] whitespace-nowrap"
              >
                <span className={i % 2 ? 'ticker-outline' : ''}>{word}</span>
                <svg viewBox="0 0 24 24" className="mx-[0.6em] size-[0.42em] fill-accent">
                  <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
                </svg>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
