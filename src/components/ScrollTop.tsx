import { useEffect, useRef, useState } from 'react'
import { ArrowUpIcon } from './ui/icons'

/**
 * A floating "back to top" button that appears after the first screen; its ring fills as you
 * scroll. It steps aside at the footer, which has its own back-to-top link.
 */
export function ScrollTop() {
  const [pastHero, setPastHero] = useState(false)
  const [atFooter, setAtFooter] = useState(false)
  const ring = useRef<SVGCircleElement>(null)
  const visible = pastHero && !atFooter

  useEffect(() => {
    const footer = document.getElementById('footer')
    if (!footer) return
    const observer = new IntersectionObserver(([entry]) => setAtFooter(entry.isIntersecting))
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      // Written straight to the DOM so scrolling never re-renders React
      ring.current?.style.setProperty('stroke-dashoffset', String(1 - progress))
      setPastHero(window.scrollY > window.innerHeight * 0.75)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <a
      id="scroll-top"
      href="#top"
      inert={!visible}
      aria-label="Back to top"
      className={`group fixed right-4 bottom-4 z-30 grid size-12 place-items-center rounded-full border border-rule bg-surface/90 text-ink backdrop-blur-md elevate-1 transition-[opacity,translate,box-shadow] duration-500 ease-expo hover:elevate-2 sm:right-6 sm:bottom-6 print:hidden ${
        visible ? '' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true" className="absolute inset-0 size-full -rotate-90">
        <circle
          ref={ring}
          cx="24"
          cy="24"
          r="22.5"
          pathLength={1}
          fill="none"
          strokeWidth="1.5"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="stroke-accent"
        />
      </svg>
      <ArrowUpIcon className="size-4 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5" />
    </a>
  )
}
