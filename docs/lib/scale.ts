// Pure helpers for the SVG charts: axis domains, ticks and number formatting.

export const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i)

/** A step of 1, 2 or 5 times a power of ten that divides `span` into about `count` parts. */
export const niceStep = (span: number, count: number): number => {
  const raw = span / Math.max(1, count)
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const normalized = raw / magnitude
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return nice * magnitude
}

/** Rounds a float that came out of repeated addition, so 0.30000000000000004 reads as 0.3. */
const clean = (n: number): number => Number(n.toFixed(10))

export type Axis = { domain: readonly [number, number]; ticks: number[] }

/** Widens `[min, max]` to round numbers and lists the ticks between them. */
export const niceAxis = ([min, max]: readonly [number, number], count = 5): Axis => {
  const [lo0, hi0] = min === max ? [min - 1, max + 1] : [min, max]
  const step = niceStep(hi0 - lo0, count)
  const lo = Math.floor(lo0 / step) * step
  const hi = Math.ceil(hi0 / step) * step
  const n = Math.round((hi - lo) / step)
  return { domain: [clean(lo), clean(hi)], ticks: range(n + 1).map((i) => clean(lo + i * step)) }
}

export const scaleLinear =
  ([d0, d1]: readonly [number, number], [r0, r1]: readonly [number, number]) =>
  (value: number): number =>
    r0 + ((value - d0) / (d1 - d0)) * (r1 - r0)

export const extent = (values: readonly number[]): [number, number] => [Math.min(...values), Math.max(...values)]

/** Formats a number with up to `digits` decimals and no trailing zeros. */
export const fmt = (n: number, digits = 2): string => (Number.isFinite(n) ? String(Number(n.toFixed(digits))) : '—')

/** Formats a number with exactly `digits` decimals, for readouts that must not jump in width. */
export const fixed = (n: number, digits = 2): string => (Number.isFinite(n) ? n.toFixed(digits) : '—')

/** Formats a rating change with its sign. */
export const signed = (n: number, digits = 2): string => (n > 0 ? '+' : '') + fixed(n, digits)
