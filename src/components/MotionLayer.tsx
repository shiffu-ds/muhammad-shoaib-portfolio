import { useEffect, useRef, useState } from 'react'

const INTERACTIVE = 'a, button, [role="button"], summary, label'

/**
 * Pointer effects for mouse and trackpad users who haven't asked for less motion: a ring
 * that trails the pointer, buttons that lean toward it ([data-magnetic], optionally with a
 * strength), plates that tilt in 3D with a glare ([data-tilt]) and glows that follow it
 * ([data-spotlight] around a .spotlight layer). It is all decoration: touch screens and
 * reduced-motion visitors never get it, and nothing depends on it.
 */
export function MotionLayer() {
  const [enabled, setEnabled] = useState(false)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    const sync = () => setEnabled(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const cursor = ring.current
    if (!enabled || !cursor) return
    const target = { x: -100, y: -100 }
    const shown = { x: -100, y: -100 }
    let frame = 0
    let magnet: HTMLElement | null = null
    let tilt: HTMLElement | null = null
    let spot: HTMLElement | null = null

    // The ring eases toward the pointer, and the loop stops once it has caught up.
    const follow = () => {
      shown.x += (target.x - shown.x) * 0.22
      shown.y += (target.y - shown.y) * 0.22
      cursor.style.translate = `${shown.x}px ${shown.y}px`
      const settled = Math.hypot(target.x - shown.x, target.y - shown.y) < 0.1
      frame = settled ? 0 : requestAnimationFrame(follow)
    }

    const release = (el: HTMLElement | null, attr: string, ...props: string[]) => {
      if (!el) return
      for (const prop of props) el.style.removeProperty(prop)
      el.removeAttribute(attr)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const { clientX: x, clientY: y } = event
      target.x = x
      target.y = y
      cursor.dataset.visible = ''
      if (!frame) frame = requestAnimationFrame(follow)

      const node = event.target instanceof Element ? event.target : null
      cursor.dataset.state = node?.closest('[data-cursor="none"]') ? 'hidden' : node?.closest(INTERACTIVE) ? 'hover' : ''

      const nextMagnet = node?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (magnet !== nextMagnet) release(magnet, 'data-pulling', '--mag-x', '--mag-y')
      magnet = nextMagnet
      if (magnet) {
        const box = magnet.getBoundingClientRect()
        const strength = Number(magnet.dataset.magnetic) || 0.3
        magnet.style.setProperty('--mag-x', `${(x - box.left - box.width / 2) * strength}px`)
        magnet.style.setProperty('--mag-y', `${(y - box.top - box.height / 2) * strength}px`)
        magnet.setAttribute('data-pulling', '')
      }

      const nextTilt = node?.closest<HTMLElement>('[data-tilt]') ?? null
      if (tilt !== nextTilt) release(tilt, 'data-tilting', '--tilt-x', '--tilt-y', '--glare-x', '--glare-y')
      tilt = nextTilt
      if (tilt) {
        const box = tilt.getBoundingClientRect()
        const px = (x - box.left) / box.width
        const py = (y - box.top) / box.height
        tilt.style.setProperty('--tilt-x', `${(0.5 - py) * 7}deg`)
        tilt.style.setProperty('--tilt-y', `${(px - 0.5) * 9}deg`)
        tilt.style.setProperty('--glare-x', `${px * 100}%`)
        tilt.style.setProperty('--glare-y', `${py * 100}%`)
        tilt.setAttribute('data-tilting', '')
      }

      const nextSpot = node?.closest<HTMLElement>('[data-spotlight]') ?? null
      if (spot !== nextSpot) release(spot, 'data-spotting')
      spot = nextSpot
      if (spot) {
        const box = spot.getBoundingClientRect()
        spot.style.setProperty('--spot-x', `${x - box.left}px`)
        spot.style.setProperty('--spot-y', `${y - box.top}px`)
        spot.setAttribute('data-spotting', '')
      }
    }

    const onLeave = (event: PointerEvent) => {
      if (event.relatedTarget) return
      delete cursor.dataset.visible
      release(magnet, 'data-pulling', '--mag-x', '--mag-y')
      release(tilt, 'data-tilting', '--tilt-x', '--tilt-y', '--glare-x', '--glare-y')
      release(spot, 'data-spotting')
      magnet = tilt = spot = null
    }
    const onDown = () => cursor.setAttribute('data-pressed', '')
    const onUp = () => cursor.removeAttribute('data-pressed')

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onLeave)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('pointerup', onUp)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onLeave)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      cancelAnimationFrame(frame)
      onLeave({ relatedTarget: null } as PointerEvent)
    }
  }, [enabled])

  return enabled ? <div ref={ring} aria-hidden="true" className="cursor-ring print:hidden" /> : null
}
