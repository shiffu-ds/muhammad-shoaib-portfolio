import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { portfolio } from '../content'
import { useActiveSection, useTheme } from '../lib/hooks'
import { isEmail } from '../lib/placeholder'
import { CONTACT_ITEM, NAV_ITEMS, SECTION_IDS } from '../lib/sections'
import { buttonClass } from './ui/button'
import { ArrowRightIcon, ContrastIcon } from './ui/icons'
import { Logo } from './ui/Logo'
import { RollText } from './ui/text'

export function Header() {
  const { name, email } = portfolio.person
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [tucked, setTucked] = useState(false)
  const [underline, setUnderline] = useState({ left: 0, width: 0, shown: false })
  const active = useActiveSection(SECTION_IDS)
  const { theme, toggle } = useTheme()
  const menuButton = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const navList = useRef<HTMLUListElement>(null)

  // Tuck the bar away while reading downwards; any scroll back up brings it back.
  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      setScrolled(y > 8)
      if (Math.abs(y - lastY) < 6) return
      setTucked(y > lastY && y > 480)
      lastY = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Slide the nav underline under the link for the section in view.
  useEffect(() => {
    const list = navList.current
    if (!list) return
    const place = () => {
      const link = list.querySelector<HTMLElement>('a[aria-current]')
      setUnderline((u) => (link ? { left: link.offsetLeft, width: link.offsetWidth, shown: true } : { ...u, shown: false }))
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(list)
    return () => observer.disconnect()
  }, [active])

  // While the mobile menu is open: lock page scroll, make the page behind it inert,
  // move focus into the menu, close on Escape, and close if the layout goes desktop.
  useEffect(() => {
    if (!menuOpen) return
    const behind = ['main', 'footer', 'scroll-top'].map((id) => document.getElementById(id))
    const desktop = window.matchMedia('(min-width: 48rem)')
    const close = () => setMenuOpen(false)
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      close()
      menuButton.current?.focus()
    }
    document.documentElement.style.overflow = 'hidden'
    behind.forEach((el) => el?.setAttribute('inert', ''))
    menu.current?.querySelector('a')?.focus()
    document.addEventListener('keydown', onKey)
    desktop.addEventListener('change', close)
    return () => {
      document.documentElement.style.overflow = ''
      behind.forEach((el) => el?.removeAttribute('inert'))
      document.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', close)
    }
  }, [menuOpen])

  const themeLabel = theme ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme` : 'Switch color theme'

  return (
    <header
      className={`sticky top-0 z-40 transition-transform duration-500 ease-expo ${
        tucked && !menuOpen ? '-translate-y-full focus-within:translate-y-0' : ''
      }`}
    >
      {/* The blur lives on its own layer: backdrop-filter on <header> would trap the fixed menu inside it. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 border-b backdrop-blur-md transition-[background-color,border-color] duration-500 ${
          scrolled || menuOpen ? 'border-rule bg-bg/85' : 'border-transparent bg-bg/40'
        }`}
      />
      {/* Fills with reading progress, in browsers with scroll-driven animations */}
      <span aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent" />
      <div className="shell flex h-16 items-center justify-between gap-4 md:h-18">
        <a href="#top" className="group -ml-1 flex min-h-11 items-center gap-2.5 rounded-lg px-1">
          <Logo className="size-7 transition-transform duration-500 ease-expo motion-safe:group-hover:-rotate-6" />
          <span className="font-display text-lg font-[500] tracking-[-0.01em]">{name}</span>
          <span className="sr-only">, back to top</span>
        </a>

        <nav aria-label="Primary" className="relative hidden md:block">
          <ul ref={navList} className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'location' : undefined}
                  className="roll inline-flex min-h-11 items-center px-3 text-[0.9375rem] text-ink-2 transition-colors duration-300 hover:text-ink aria-[current=location]:text-ink"
                >
                  <RollText text={item.label} />
                </a>
              </li>
            ))}
          </ul>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1.5 left-0 h-0.5 rounded-full bg-accent transition-[translate,width,opacity] duration-500 ease-expo"
            style={{
              translate: `${underline.left + 12}px 0`,
              width: Math.max(0, underline.width - 24),
              opacity: underline.shown ? 1 : 0,
            }}
          />
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={(event) => {
              const box = event.currentTarget.getBoundingClientRect()
              toggle({ x: box.left + box.width / 2, y: box.top + box.height / 2 })
            }}
            aria-label={themeLabel}
            title={themeLabel}
            className="grid size-11 place-items-center rounded-full text-ink-2 transition-colors duration-300 hover:bg-surface hover:text-ink"
          >
            <ContrastIcon
              className={`size-5 transition-transform duration-700 ease-expo ${theme === 'dark' ? 'rotate-180' : ''}`}
            />
          </button>
          <a href={`#${CONTACT_ITEM.id}`} data-magnetic className={buttonClass('primary', 'max-md:hidden')}>
            Get in touch
            <ArrowRightIcon className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" />
          </a>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Menu"
            className="grid size-11 place-items-center rounded-full text-ink transition-colors duration-300 hover:bg-surface md:hidden"
          >
            {/* Two lines that fold into a cross */}
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={`absolute inset-x-0 top-0 h-[1.5px] rounded-full bg-current transition-transform duration-300 ease-soft ${
                  menuOpen ? 'translate-y-[5.25px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-current transition-transform duration-300 ease-soft ${
                  menuOpen ? '-translate-y-[5.25px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={menu}
        hidden={!menuOpen}
        className="menu-panel fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-bg md:hidden"
      >
        <nav aria-label="Primary" className="shell flex min-h-full flex-col pt-6 pb-10">
          <ul className="border-t border-rule">
            {[...NAV_ITEMS, CONTACT_ITEM].map((item, i) => (
              <li key={item.id} style={{ '--i': i } as CSSProperties} className="border-b border-rule">
                <a
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active === item.id ? 'location' : undefined}
                  className="flex min-h-16 items-center justify-between font-display text-3xl tracking-[-0.01em] aria-[current=location]:text-accent"
                >
                  {item.label}
                  <span aria-hidden="true" className="font-mono text-xs text-ink-3">
                    0{i + 1}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {isEmail(email) && (
            <div className="mt-auto pt-12">
              <a href={`mailto:${email}`} className={buttonClass('primary', 'w-full')}>
                Email me
              </a>
              <p className="mt-4 text-center font-mono text-xs break-all text-ink-3">{email}</p>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
