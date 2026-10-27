'use client'
import { useState } from 'react'
import { Chart } from '@/components/chart'
import { Choice, Slider } from '@/components/controls'
import { Readout } from '@/components/readout'
import { fixed } from '@/lib/scale'
import { ordinal, rating } from '@/lib/openskill'
import { muSeries, ordinalSeries, patterns, playSeries, type PatternName } from '@/lib/scenarios'

const PATTERNS = [
  { value: 'alternating', label: 'alternating' },
  { value: 'streak', label: 'all wins' },
  { value: 'improvement', label: 'skill rises half way' },
] as const

export function OrdinalExplorer() {
  const [z, setZ] = useState(3)
  const [alpha, setAlpha] = useState(1)
  const [target, setTarget] = useState(0)
  const [games, setGames] = useState(50)
  const [pattern, setPattern] = useState<PatternName>('alternating')

  const options = { z, alpha, target }
  const ratings = playSeries(rating(), patterns[pattern](games))
  const last = ratings[ratings.length - 1]

  return (
    <div className="explorer">
      <div className="controls">
        <Slider label="z" value={z} min={0} max={5} step={0.1} onChange={setZ} format={(v) => fixed(v, 1)} />
        <Slider
          label="alpha"
          value={alpha}
          min={0.1}
          max={5}
          step={0.1}
          onChange={setAlpha}
          format={(v) => fixed(v, 1)}
        />
        <Slider label="target" value={target} min={-50} max={100} step={5} onChange={setTarget} />
        <Slider label="games" value={games} min={10} max={200} step={10} onChange={setGames} />
        <Choice label="results" value={pattern} options={PATTERNS} onChange={setPattern} />
      </div>
      <Chart
        title="Ordinal and mu over the games"
        series={[
          { label: 'ordinal', points: ordinalSeries(ratings, options) },
          { label: 'mu', points: muSeries(ratings), dashed: true },
        ]}
        xLabel="games played"
        yLabel="rating"
      />
      <Readout
        items={[
          ['ordinal after the last game', fixed(ordinal(last, options), 3)],
          ['mu after the last game', fixed(last.mu, 3)],
          ['sigma after the last game', fixed(last.sigma, 3)],
        ]}
      />
    </div>
  )
}
