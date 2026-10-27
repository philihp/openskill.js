// A line chart drawn as inline SVG. It has no state and no browser APIs, so
// the build renders it into the static HTML, and the explorers redraw it on
// every slider change.
import { extent, fmt, niceAxis, scaleLinear } from '@/lib/scale'

export type XY = readonly [number, number]

export type Series = {
  label: string
  points: readonly XY[]
  color?: string
  /** Draw a dashed line, for a reference series. */
  dashed?: boolean
  /** Mark each point with a dot, for discrete x values such as positions. */
  dots?: boolean
}

export type Marker = { x: number; label?: string }

export const palette = ['#0969da', '#cf222e', '#1f883d', '#8250df', '#bf8700', '#0598b4', '#e16f24'] as const

type Props = {
  /** Read by screen readers and shown as the SVG title. */
  title: string
  series: readonly Series[]
  xLabel: string
  yLabel: string
  xDomain?: readonly [number, number]
  yDomain?: readonly [number, number]
  xTicks?: readonly number[]
  /** Keep y = 0 in view, so a change of sign is visible. Default true. */
  includeZero?: boolean
  /** A vertical reference line, for the value a slider selects. */
  marker?: Marker
  height?: number
}

const WIDTH = 640
const LEFT = 56
const RIGHT = 16
const BOTTOM = 46
const LEGEND_ROW = 20

type LegendItem = { index: number; x: number; row: number; width: number }

/** Places legend items left to right, and starts a new row when one would overflow. */
const layoutLegend = (labels: readonly string[], maxWidth: number): LegendItem[] =>
  labels.reduce<LegendItem[]>((acc, label, index) => {
    const width = 26 + label.length * 6.5 + 14
    const prev = acc[acc.length - 1]
    const next = prev ? prev.x + prev.width : 0
    const wraps = prev !== undefined && next + width > maxWidth
    acc.push({ index, width, x: wraps ? 0 : next, row: prev ? prev.row + (wraps ? 1 : 0) : 0 })
    return acc
  }, [])

const finite = (p: XY): boolean => Number.isFinite(p[0]) && Number.isFinite(p[1])

const pathOf = (points: readonly XY[], sx: (x: number) => number, sy: (y: number) => number): string =>
  points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(' ')

export function Chart({
  title,
  series,
  xLabel,
  yLabel,
  xDomain,
  yDomain,
  xTicks,
  includeZero = true,
  marker,
  height = 320,
}: Props) {
  const drawn = series.map((s) => ({ ...s, points: s.points.filter(finite) }))
  const xs = drawn.flatMap((s) => s.points.map((p) => p[0]))
  const ys = drawn.flatMap((s) => s.points.map((p) => p[1])).concat(includeZero ? [0] : [])

  const xAxis = niceAxis(xDomain ?? extent(xs.length ? xs : [0, 1]), 6)
  const yAxis = niceAxis(yDomain ?? extent(ys.length ? ys : [0, 1]), 5)
  const xTickValues = xTicks ?? xAxis.ticks

  const legend = layoutLegend(
    drawn.map((s) => s.label),
    WIDTH - LEFT - RIGHT
  )
  const legendRows = legend.length ? legend[legend.length - 1].row + 1 : 0
  const top = 12 + legendRows * LEGEND_ROW + 8

  const x0 = LEFT
  const x1 = WIDTH - RIGHT
  const y0 = top
  const y1 = height - BOTTOM
  const sx = scaleLinear(xAxis.domain, [x0, x1])
  const sy = scaleLinear(yAxis.domain, [y1, y0])
  const colorOf = (s: Series, i: number) => s.color ?? palette[i % palette.length]
  const zeroInView = yAxis.domain[0] < 0 && yAxis.domain[1] > 0

  return (
    <svg className="chart" viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={title}>
      <title>{title}</title>

      <g className="legend">
        {legend.map(({ index, x, row }) => (
          <g key={index} transform={`translate(${x0 + x}, ${12 + row * LEGEND_ROW})`}>
            <line
              x1={0}
              x2={20}
              y1={6}
              y2={6}
              stroke={colorOf(drawn[index], index)}
              strokeWidth={2.5}
              strokeDasharray={drawn[index].dashed ? '6 4' : undefined}
            />
            <text x={26} y={10}>
              {drawn[index].label}
            </text>
          </g>
        ))}
      </g>

      {yAxis.ticks.map((t) => (
        <g key={`y${t}`}>
          <line className="grid" x1={x0} x2={x1} y1={sy(t)} y2={sy(t)} />
          <text className="tick" x={x0 - 8} y={sy(t)} dy="0.32em" textAnchor="end">
            {fmt(t)}
          </text>
        </g>
      ))}
      {xTickValues.map((t) => (
        <g key={`x${t}`}>
          <line className="axis" x1={sx(t)} x2={sx(t)} y1={y1} y2={y1 + 5} />
          <text className="tick" x={sx(t)} y={y1 + 18} textAnchor="middle">
            {fmt(t)}
          </text>
        </g>
      ))}
      <line className="axis" x1={x0} x2={x1} y1={y1} y2={y1} />
      <line className="axis" x1={x0} x2={x0} y1={y0} y2={y1} />
      {zeroInView && <line className="zero" x1={x0} x2={x1} y1={sy(0)} y2={sy(0)} />}

      {drawn.map((s, i) => (
        <g key={s.label}>
          <path
            d={pathOf(s.points, sx, sy)}
            fill="none"
            stroke={colorOf(s, i)}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={s.dashed ? '6 4' : undefined}
          />
          {s.dots && s.points.map(([x, y]) => <circle key={x} cx={sx(x)} cy={sy(y)} r={4} fill={colorOf(s, i)} />)}
        </g>
      ))}

      {marker && Number.isFinite(marker.x) && (
        <g className="marker">
          <line x1={sx(marker.x)} x2={sx(marker.x)} y1={y0} y2={y1} />
          {marker.label && (
            <text x={sx(marker.x) + 6} y={y0 + 14}>
              {marker.label}
            </text>
          )}
        </g>
      )}

      <text className="label" x={(x0 + x1) / 2} y={height - 10} textAnchor="middle">
        {xLabel}
      </text>
      <text className="label" transform={`translate(14, ${(y0 + y1) / 2}) rotate(-90)`} textAnchor="middle">
        {yLabel}
      </text>
    </svg>
  )
}
