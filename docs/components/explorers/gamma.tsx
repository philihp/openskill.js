'use client'
import { useState } from 'react'
import { Chart } from '@/components/chart'
import { Slider } from '@/components/controls'
import { Readout } from '@/components/readout'
import { fixed } from '@/lib/scale'
import { rating } from '@/lib/openskill'
import { alternating, muSeries, playSeries, scaledGamma, sigmaSeries } from '@/lib/scenarios'

export function GammaExplorer() {
  const [scale, setScale] = useState(1)
  const [games, setGames] = useState(50)

  const ratings = playSeries(rating(), alternating(games), { gamma: scaledGamma(scale) })
  const reference = playSeries(rating(), alternating(games))
  const last = ratings[ratings.length - 1]

  return (
    <div className="explorer">
      <div className="controls">
        <Slider
          label="multiplier on the default gamma"
          value={scale}
          min={0}
          max={4}
          step={0.05}
          onChange={setScale}
          format={(v) => fixed(v, 2)}
        />
        <Slider label="games" value={games} min={10} max={200} step={10} onChange={setGames} />
      </div>
      <Chart
        title="Sigma over the games"
        series={[
          { label: `gamma × ${fixed(scale, 2)}`, points: sigmaSeries(ratings) },
          { label: 'default gamma', points: sigmaSeries(reference), dashed: true },
        ]}
        xLabel="games played"
        yLabel="sigma"
      />
      <Chart
        title="Mu over the games"
        series={[
          { label: `gamma × ${fixed(scale, 2)}`, points: muSeries(ratings) },
          { label: 'default gamma', points: muSeries(reference), dashed: true },
        ]}
        xLabel="games played"
        yLabel="mu"
        includeZero={false}
        height={240}
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
