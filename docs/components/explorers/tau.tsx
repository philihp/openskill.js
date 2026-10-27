'use client'
import { useState } from 'react'
import { Chart } from '@/components/chart'
import { Choice, Slider, Toggle } from '@/components/controls'
import { Readout } from '@/components/readout'
import { fixed } from '@/lib/scale'
import { MU, SIGMA, TAU, muSeries, patterns, player, playSeries, sigmaSeries, type PatternName } from '@/lib/scenarios'

const PATTERNS = [
  { value: 'alternating', label: 'alternating' },
  { value: 'improvement', label: 'skill rises half way' },
] as const

export function TauExplorer() {
  const [tau, setTau] = useState(TAU)
  const [limitSigma, setLimitSigma] = useState(false)
  const [startSigma, setStartSigma] = useState(SIGMA)
  const [games, setGames] = useState(100)
  const [pattern, setPattern] = useState<PatternName>('improvement')

  const ratings = playSeries(player(MU, startSigma), patterns[pattern](games), { tau, limitSigma })
  const reference = playSeries(player(MU, startSigma), patterns[pattern](games), { tau: 0 })
  const last = ratings[ratings.length - 1]
  const marker = pattern === 'improvement' ? { x: games / 2, label: 'skill rises' } : undefined

  return (
    <div className="explorer">
      <div className="controls">
        <Slider label="tau" value={tau} min={0} max={2} step={0.01} onChange={setTau} format={(v) => fixed(v, 2)} />
        <Slider
          label="starting sigma"
          value={startSigma}
          min={0.5}
          max={15}
          step={0.1}
          onChange={setStartSigma}
          format={(v) => fixed(v, 1)}
        />
        <Slider label="games" value={games} min={20} max={300} step={10} onChange={setGames} />
        <Choice label="results" value={pattern} options={PATTERNS} onChange={setPattern} />
        <Toggle label="limitSigma" checked={limitSigma} onChange={setLimitSigma} />
      </div>
      <Chart
        title="Sigma over the games"
        series={[
          { label: 'sigma', points: sigmaSeries(ratings) },
          { label: 'sigma with tau = 0', points: sigmaSeries(reference), dashed: true },
        ]}
        xLabel="games played"
        yLabel="sigma"
        marker={marker}
        height={240}
      />
      <Chart
        title="Mu over the games"
        series={[
          { label: 'mu', points: muSeries(ratings) },
          { label: 'mu with tau = 0', points: muSeries(reference), dashed: true },
        ]}
        xLabel="games played"
        yLabel="mu"
        marker={marker}
        includeZero={false}
      />
      <Readout
        items={[
          ['sigma after the last game', fixed(last.sigma, 3)],
          ['mu after the last game', fixed(last.mu, 3)],
        ]}
      />
    </div>
  )
}
