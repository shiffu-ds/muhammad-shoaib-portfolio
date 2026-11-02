import { portfolio } from '../content'
import { hasDestination } from '../lib/placeholder'
import { HeroFigure } from './HeroFigure'
import { buttonClass } from './ui/button'
import { ArrowDownIcon } from './ui/icons'
import { ResumeLink } from './ui/links'
import { Scramble } from './ui/animated'
import { Fill, Highlight, Letters } from './ui/text'

export function Hero() {
  const { name, avatar, field, statement, highlight, intro, availability, location, resumeUrl } = portfolio.person

  return (
    <section id="top" aria-labelledby="hero-title" data-spotlight className="relative isolate">
      {/* Reaches up behind the sticky header so its blur picks up the grid */}
      <div
        aria-hidden="true"
        className="backdrop pointer-events-none absolute inset-x-0 -top-18 bottom-0 -z-10 motion-safe:animate-fade"
      />
      <div aria-hidden="true" className="spotlight pointer-events-none absolute inset-0 -z-10" />
      <div className="hero-exit shell grid min-h-[calc(100svh-4rem)] content-center items-center gap-x-12 gap-y-14 py-14 sm:py-20 md:min-h-[calc(100svh-4.5rem)] lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-4">
            {avatar && (
              <img
                src={avatar.src}
                srcSet={avatar.srcSet}
                sizes="52px"
                width={avatar.width}
                height={avatar.height}
                alt={avatar.alt}
                decoding="async"
                className="size-13 shrink-0 rounded-full border-2 border-surface object-cover outline outline-offset-2 outline-accent/40 elevate-1 motion-safe:animate-pop"
              />
            )}
            <p className="eyebrow flex items-center gap-2.5 motion-safe:animate-rise motion-safe:[animation-delay:100ms]">
              {!avatar && <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />}
              <Scramble text={field} />
            </p>
          </div>
          <h1
            id="hero-title"
            className="hero-name mt-6 font-display text-[clamp(3.25rem,10vw,7.5rem)] leading-[0.92] font-[370] tracking-[-0.035em]"
          >
            <Letters text={name} />
          </h1>
          <p className="mt-8 max-w-[22ch] font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.2] font-[360] tracking-[-0.01em] motion-safe:animate-rise motion-safe:[animation-delay:320ms]">
            <Highlight text={statement} phrase={highlight} />
          </p>
          <p className="mt-6 max-w-[52ch] text-lg text-ink-2 motion-safe:animate-rise motion-safe:[animation-delay:420ms]">
            <Fill text={intro} />
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3 motion-safe:animate-rise motion-safe:[animation-delay:520ms]">
            <a href="#work" data-magnetic className={buttonClass('primary')}>
              View my work
              <ArrowDownIcon className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-y-0.5" />
            </a>
            <a href="#contact" data-magnetic className={buttonClass('secondary')}>
              Contact me
            </a>
            {hasDestination(resumeUrl) && <ResumeLink url={resumeUrl} />}
          </div>
          {/* The dot stays beside the first line; the text wraps on its own on narrow screens */}
          <p className="mt-10 inline-flex items-start gap-2.5 rounded-3xl border border-rule bg-surface/70 px-4 py-2 font-mono text-[0.8125rem] text-ink-2 backdrop-blur-sm motion-safe:animate-rise motion-safe:[animation-delay:620ms]">
            <span aria-hidden="true" className="status-dot mt-[0.45em]" />
            <span>
              <Fill text={availability} />
              <span aria-hidden="true" className="px-2 text-ink-3">
                /
              </span>
              <span className="whitespace-nowrap">
                <Fill text={location} />
              </span>
            </span>
          </p>
        </div>

        <div className="lg:col-span-5 motion-safe:animate-rise motion-safe:[animation-delay:380ms]">
          <HeroFigure />
        </div>
      </div>
    </section>
  )
}
