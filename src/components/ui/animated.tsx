import { useEffect, useRef } from 'react'
import { prefersLessMotion } from '../../lib/hooks'
import { isPlaceholder } from '../../lib/placeholder'
import { Fill } from './text'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>'

/** Runs `start` once the element scrolls into view; returns a cleanup for both. */
function whenInView(el: Element, start: () => () => void, threshold = 0) {
  let stop = () => {}
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      stop = start()
    },
    { rootMargin: '0px 0px -10% 0px', threshold },
  )
  observer.observe(el)
  return () => {
    observer.disconnect()
    stop()
  }
}

/**
 * Text that decodes from random glyphs, left to right, as it scrolls into view. Meant for
 * monospaced labels so nothing shifts while it runs. The server-rendered text is final, so
 * nothing changes without JavaScript; screen readers only ever get the real text.
 */
export function Scramble({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersLessMotion()) return
    const chars = [...text]
    const stop = whenInView(el, () => {
      const begin = performance.now()
      const duration = 350 + chars.length * 40
      let last = 0
      let frame = requestAnimationFrame(function step(now) {
        const progress = Math.min(1, (now - begin) / duration)
        // About 30 updates a second reads as flicker, not noise
        if (now - last > 32 || progress === 1) {
          last = now
          const settled = Math.floor(progress * chars.length)
          el.textContent = chars
            .map((char, i) => (i < settled || !char.trim() ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join('')
        }
        if (progress < 1) frame = requestAnimationFrame(step)
      })
      return () => cancelAnimationFrame(frame)
    })
    return () => {
      stop()
      el.textContent = text
    }
  }, [text])

  return (
    <>
      <span ref={ref} aria-hidden="true" className={className}>
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </>
  )
}

const NUMBER = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/s

/**
 * A result such as "94%", "3.2×" or "1,200 users" that counts up from zero when it comes
 * into view. Placeholders and text without a number are shown as they are.
 */
export function CountUp({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const match = isPlaceholder(text) ? null : NUMBER.exec(text)

  useEffect(() => {
    const el = ref.current
    const parts = NUMBER.exec(text)
    if (!el || !parts || prefersLessMotion()) return
    const [, before, digits, after] = parts
    const value = Number(digits.replace(/,/g, ''))
    const decimals = digits.split('.')[1]?.length ?? 0
    const format = (n: number) =>
      before +
      n.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: digits.includes(','),
      }) +
      after

    el.textContent = format(0)
    const stop = whenInView(
      el,
      () => {
        const begin = performance.now()
        let frame = requestAnimationFrame(function step(now) {
          const t = Math.min(1, (now - begin) / 1600)
          el.textContent = format(value * (1 - (1 - t) ** 4))
          if (t < 1) frame = requestAnimationFrame(step)
        })
        return () => cancelAnimationFrame(frame)
      },
      0.6,
    )
    return () => {
      stop()
      el.textContent = text
    }
  }, [text])

  if (!match) return <Fill text={text} />
  return (
    <>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </>
  )
}
