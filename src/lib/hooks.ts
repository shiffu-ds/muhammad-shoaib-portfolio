import { useEffect, useRef, useState } from 'react'

export const prefersLessMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** The id of whichever section is crossing the middle of the viewport. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const id of ids) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [ids])

  return active
}

type Theme = 'light' | 'dark'

const darkQuery = '(prefers-color-scheme: dark)'

function readTheme(): Theme {
  const chosen = document.documentElement.dataset.theme
  if (chosen === 'light' || chosen === 'dark') return chosen
  return window.matchMedia(darkQuery).matches ? 'dark' : 'light'
}

/** Follows the system theme until the visitor picks one, then remembers the choice. */
export function useTheme() {
  // null until mounted, so the server-rendered markup matches the first client render
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const media = window.matchMedia(darkQuery)
    const sync = () => setTheme(readTheme())
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  /** Switches theme; given a point (the toggle's centre), the new theme grows out of it as a circle. */
  function toggle(origin?: { x: number; y: number }) {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
    const apply = () => {
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem('theme', next)
      } catch {
        // Storage is unavailable (private mode, blocked cookies): the choice lasts for this visit.
      }
    }
    setTheme(next)
    if (!origin || prefersLessMotion() || !('startViewTransition' in document)) return apply()

    const { x, y } = origin
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    document.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  return { theme, toggle }
}

/** Eases a displayed number toward `value` whenever it changes (instantly for reduced motion). */
export function useTween(value: number, duration = 800) {
  const [shown, setShown] = useState(value)
  const current = useRef(value)

  useEffect(() => {
    const from = current.current
    if (from === value) return
    if (prefersLessMotion()) {
      current.current = value
      setShown(value)
      return
    }
    const start = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / duration)
      current.current = from + (value - from) * (1 - (1 - t) ** 3)
      setShown(current.current)
      if (t < 1) frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return shown
}
