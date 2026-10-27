'use client'
import { useState } from 'react'
import { Chart } from '@/components/chart'
import { Slider } from '@/components/controls'
import { Readout } from '@/components/readout'
import { fixed, signed } from '@/lib/scale'
import { BETA, SIGMA, duelDelta, gapCurve, winProbability } from '@/lib/scenarios'

export function BetaExplorer() {
  const [beta, setBeta] = useState(BETA)
  const [gap, setGap] = useState(10)
  const [sigma, setSigma] = useState(SIGMA)

  const options = { beta }
  const marker = { x: gap, label: 'selected gap' }

  return (
    <div className="explorer">
      <div className="controls">
        <Slider
          label="beta"
          value={beta}
          min={0.5}
          max={15}
          step={0.1}
          onChange={setBeta}
          format={(v) => fixed(v, 1)}
        />
        <Slider
          label="rating gap, A minus B"
          value={gap}
          min={-30}
          max={30}
          onChange={setGap}
          format={(v) => signed(v, 0)}
        />
        <Slider
          label="sigma of both players"
          value={sigma}
          min={0.5}
          max={12}
          step={0.1}
          onChange={setSigma}
          format={(v) => fixed(v, 1)}
        />
      </div>
      <Chart
        title="Chance that A wins against rating gap"
        series={[{ label: 'chance that A wins', points: gapCurve((g) => winProbability(g, sigma, options)) }]}
        xLabel="rating gap, mu of A minus mu of B"
        yLabel="chance that A wins"
        yDomain={[0, 1]}
        marker={marker}
        height={240}
      />
      <Chart
        title="Rating change of A against rating gap, after a win and after a loss"
        series={[
          { label: 'A wins', points: gapCurve((g) => duelDelta(g, sigma, 'win', options)) },
          { label: 'A loses', points: gapCurve((g) => duelDelta(g, sigma, 'loss', options)), dashed: true },
        ]}
        xLabel="rating gap, mu of A minus mu of B"
        yLabel="change in mu of A"
        marker={marker}
      />
      <Readout
        items={[
          ['chance that A wins', fixed(winProbability(gap, sigma, options), 3)],
          ['change in mu of A after a win', signed(duelDelta(gap, sigma, 'win', options))],
          ['change in mu of A after a loss', signed(duelDelta(gap, sigma, 'loss', options))],
        ]}
      />
    </div>
  )
}
