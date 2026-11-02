/**
 * The hero figure is a real (if tiny) model: noisy samples from a smooth curve,
 * fitted with an ordinary-least-squares cubic. Seeded, so the server-rendered
 * page and the browser draw the same picture until someone presses "Resample".
 */

type Point = { x: number; y: number }

export const FIGURE = { width: 400, height: 280, left: 30, right: 10, top: 12, bottom: 26 }

function mulberry32(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const signal = (x: number) => 0.5 + 0.32 * Math.tanh(4.4 * (x - 0.5)) + 0.04 * Math.sin(10 * x)

function samplePoints(seed: number, count: number): Point[] {
  const random = mulberry32(seed)
  // Box–Muller transform for normally distributed noise
  const normal = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random())
  return Array.from({ length: count }, () => {
    const x = 0.02 + 0.96 * random()
    return { x, y: signal(x) + 0.07 * normal() }
  }).sort((a, b) => a.x - b.x)
}

/** Least-squares polynomial fit via the normal equations and Gauss–Jordan elimination. */
function fitPolynomial(points: Point[], degree: number) {
  const size = degree + 1
  const rows = Array.from({ length: size }, () => new Array<number>(size + 1).fill(0))
  for (const { x, y } of points) {
    const t = 2 * x - 1 // centre x on [-1, 1] to keep the system well conditioned
    const powers = [1]
    for (let k = 1; k < 2 * size - 1; k++) powers.push(powers[k - 1] * t)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) rows[i][j] += powers[i + j]
      rows[i][size] += powers[i] * y
    }
  }
  for (let col = 0; col < size; col++) {
    let pivot = col
    for (let r = col + 1; r < size; r++) if (Math.abs(rows[r][col]) > Math.abs(rows[pivot][col])) pivot = r
    ;[rows[col], rows[pivot]] = [rows[pivot], rows[col]]
    for (let r = 0; r < size; r++) {
      if (r === col) continue
      const factor = rows[r][col] / rows[col][col]
      for (let k = col; k <= size; k++) rows[r][k] -= factor * rows[col][k]
    }
  }
  const coefficients = rows.map((row, i) => row[size] / row[i])
  const predict = (x: number) => coefficients.reduceRight((acc, c) => acc * (2 * x - 1) + c, 0)

  const mean = points.reduce((sum, p) => sum + p.y, 0) / points.length
  let residual = 0
  let total = 0
  for (const p of points) {
    residual += (p.y - predict(p.x)) ** 2
    total += (p.y - mean) ** 2
  }
  return { predict, sigma: Math.sqrt(residual / (points.length - size)), r2: 1 - residual / total }
}

/** Everything needed to draw the figure, in SVG user units. */
export function buildFigure(seed: number, count = 48) {
  const points = samplePoints(seed, count)
  const fit = fitPolynomial(points, 3)
  const plotWidth = FIGURE.width - FIGURE.left - FIGURE.right
  const plotHeight = FIGURE.height - FIGURE.top - FIGURE.bottom
  const sx = (x: number) => FIGURE.left + x * plotWidth
  const sy = (y: number) => FIGURE.top + (1 - y) * plotHeight

  const steps = Array.from({ length: 61 }, (_, i) => i / 60)
  const trace = (offset: number) => steps.map((x) => [sx(x), sy(fit.predict(x) + offset)] as const)
  const path = (coords: (readonly [number, number])[]) =>
    coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('')

  return {
    dots: points.map((p) => ({ cx: sx(p.x), cy: sy(p.y), bin: Math.min(5, Math.floor(p.x * 6)) })),
    curve: path(trace(0)),
    band: `${path([...trace(2 * fit.sigma), ...trace(-2 * fit.sigma).reverse()])}Z`,
    ticks: [0, 0.25, 0.5, 0.75, 1].map((value) => ({ value, x: sx(value), y: sy(value) })),
    plot: { x: FIGURE.left, y: FIGURE.top, width: plotWidth, height: plotHeight },
    predict: fit.predict,
    sx,
    sy,
    n: count,
    r2: fit.r2,
    sigma: fit.sigma,
  }
}
