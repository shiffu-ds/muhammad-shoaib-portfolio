import { useId, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { buildFigure, FIGURE } from '../lib/figure'
import { useTween } from '../lib/hooks'
import { RefreshIcon } from './ui/icons'

// Viridis bins, left to right. Written out in full so Tailwind can see the class names.
const DOT_COLORS = ['fill-viz-1', 'fill-viz-2', 'fill-viz-3', 'fill-viz-4', 'fill-viz-5', 'fill-viz-6']

export function HeroFigure() {
  const [seed, setSeed] = useState(7)
  const [probe, setProbe] = useState<number | null>(null)
  const fig = useMemo(() => buildFigure(seed), [seed])
  const r2 = useTween(fig.r2)
  const sigma = useTween(fig.sigma)
  const svg = useRef<SVGSVGElement>(null)
  const id = useId().replace(/[^\w-]/g, '')
  const bottom = FIGURE.height - FIGURE.bottom
  const right = FIGURE.width - FIGURE.right

  // Read the fitted curve wherever the pointer is over the plot.
  function track(event: PointerEvent<SVGSVGElement>) {
    const matrix = svg.current?.getScreenCTM()
    if (!matrix) return
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
    const x = (point.x - fig.plot.x) / fig.plot.width
    const inside = x >= 0 && x <= 1 && point.y >= fig.plot.y && point.y <= bottom
    setProbe(inside ? x : null)
  }

  const probeX = probe === null ? 0 : fig.sx(probe)
  const probeY = probe === null ? 0 : fig.predict(probe)
  const labelRight = probe !== null && probe < 0.62

  return (
    <figure className="elevate-1 rounded-2xl border border-rule bg-surface/90 p-4 backdrop-blur-sm sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">Fig. 0 — Cubic fit</p>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="group -my-2 -mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-mono text-xs text-ink-2 transition-colors duration-300 hover:bg-bg hover:text-ink"
        >
          <RefreshIcon className="size-4 transition-transform duration-700 ease-expo motion-safe:group-hover:-rotate-90 motion-safe:group-active:-rotate-180" />
          Resample
        </button>
      </div>

      <svg
        ref={svg}
        viewBox={`0 0 ${FIGURE.width} ${FIGURE.height}`}
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
        onPointerMove={track}
        onPointerDown={track}
        onPointerLeave={() => setProbe(null)}
        onPointerCancel={() => setProbe(null)}
        data-cursor="none"
        className="mt-3 h-auto w-full cursor-crosshair touch-pan-y overflow-visible"
      >
        <title id={`${id}-title`}>Scatter plot with a fitted curve</title>
        <desc id={`${id}-desc`}>
          {fig.n} noisy samples rising from left to right, a cubic least-squares fit through them, and a shaded band
          two residual standard deviations wide.
        </desc>
        <defs>
          <clipPath id={`${id}-clip`}>
            <rect x={fig.plot.x} y={fig.plot.y} width={fig.plot.width} height={fig.plot.height} />
          </clipPath>
        </defs>

        <g className="stroke-rule" strokeWidth="1" strokeDasharray="2 4">
          {fig.ticks.map((t) => (
            <line key={`h${t.value}`} x1={FIGURE.left} x2={right} y1={t.y} y2={t.y} />
          ))}
          {fig.ticks.map((t) => (
            <line key={`v${t.value}`} x1={t.x} x2={t.x} y1={FIGURE.top} y2={bottom} />
          ))}
        </g>
        <path d={`M${FIGURE.left} ${FIGURE.top}V${bottom}H${right}`} fill="none" className="stroke-ink-3" />
        <g className="fill-ink-3 font-mono text-[10px]">
          {fig.ticks.map((t) => (
            <text key={`x${t.value}`} x={t.x} y={bottom + 16} textAnchor="middle">
              {t.value}
            </text>
          ))}
          {fig.ticks.map((t) => (
            <text key={`y${t.value}`} x={FIGURE.left - 8} y={t.y + 3.5} textAnchor="end">
              {t.value}
            </text>
          ))}
        </g>

        {/* Keyed by seed so the draw-in animation replays on every resample */}
        <g key={seed} clipPath={`url(#${id}-clip)`}>
          <path d={fig.band} className="fig-band fill-accent/10" />
          {fig.dots.map((dot, i) => (
            <circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r="3.2"
              className={`fig-dot ${DOT_COLORS[dot.bin]}`}
              style={{ '--i': i } as CSSProperties}
            />
          ))}
          <path
            d={fig.curve}
            pathLength={1}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            className="fig-curve stroke-ink"
          />
        </g>

        {probe !== null && (
          <g className="pointer-events-none">
            <line
              x1={probeX}
              x2={probeX}
              y1={fig.plot.y}
              y2={bottom}
              strokeDasharray="3 3"
              className="stroke-accent"
            />
            <circle cx={probeX} cy={fig.sy(probeY)} r="5" strokeWidth="2" className="fill-surface stroke-accent" />
            <g transform={`translate(${labelRight ? probeX + 8 : probeX - 108} ${fig.plot.y + 4})`}>
              <rect width="100" height="20" rx="4" className="fill-ink" />
              <text x="50" y="13.5" textAnchor="middle" className="fill-bg font-mono text-[10px]">
                f({probe.toFixed(2)}) = {probeY.toFixed(2)}
              </text>
            </g>
          </g>
        )}
      </svg>

      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-ink-2">
        <span>Least-squares fit with a two-sigma band, computed in your browser. Point at the plot to read it.</span>
        <span aria-hidden="true" suppressHydrationWarning className="font-mono text-xs text-ink-3 tabular-nums">
          n = {fig.n} · R² = {r2.toFixed(2)} · σ = {sigma.toFixed(3)}
        </span>
        <span aria-live="polite" suppressHydrationWarning className="sr-only">
          {`${fig.n} samples, R squared ${fig.r2.toFixed(2)}, residual standard deviation ${fig.sigma.toFixed(3)}`}
        </span>
      </figcaption>
    </figure>
  )
}
