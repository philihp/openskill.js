'use client'
import { useState } from 'react'
import { Chart } from '@/components/chart'
import { Choice, Slider } from '@/components/controls'
import { Readout } from '@/components/readout'
import { fixed } from '@/lib/scale'
import { MU, SIGMA, muSeries, patterns, player, playSeries, sigmaSeries, type PatternName } from '@/lib/scenarios'

const PATTERNS = [
  { value: 'streak', label: 'all wins' },
  { value: 'alternating', label: 'alternating' },
] as const

export function SigmaExplorer() {
  const [mu, setMu] = useState(MU)
  const [sigma, setSigma] = useState(SIGMA)
  const [games, setGames] = useState(20)
  const [pattern, setPattern] = useState<PatternName>('streak')

  const ratings = playSeries(player(mu, sigma), patterns[pattern](games))
  const reference = playSeries(player(mu, SIGMA), patterns[pattern](games))
  const last = ratings[ratings.length - 1]

  return (
    <div className="explorer">
      <div className="controls">
        <Slider label="starting mu" value={mu} min={0} max={50} onChange={setMu} />
        <Slider
          label="starting sigma"
          value={sigma}
          min={0.5}
          max={20}
          step={0.1}
          onChange={setSigma}
          format={(v) => fixed(v, 1)}
        />
        <Slider label="games" value={games} min={5} max={100} step={5} onChange={setGames} />
        <Choice label="results" value={pattern} options={PATTERNS} onChange={setPattern} />
      </div>
      <Chart
        title="Mu over the games"
        series={[
          { label: 'mu', points: muSeries(ratings) },
          { label: 'mu with the default sigma', points: muSeries(reference), dashed: true },
        ]}
        xLabel="games played"
        yLabel="mu"
        includeZero={false}
      />
      <Chart
        title="Sigma over the games"
        series={[
          { label: 'sigma', points: sigmaSeries(ratings) },
          { label: 'sigma from the default', points: sigmaSeries(reference), dashed: true },
        ]}
        xLabel="games played"
        yLabel="sigma"
        height={240}
      />
      <Readout
        items={[
          ['mu after the last game', fixed(last.mu, 3)],
          ['sigma after the last game', fixed(last.sigma, 3)],
        ]}
      />
    </div>
  )
}
