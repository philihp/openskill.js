'use client'
import { useState } from 'react'
import { Chart } from '@/components/chart'
import { Choice, Slider } from '@/components/controls'
import { Readout } from '@/components/readout'
import { fixed, signed } from '@/lib/scale'
import { thurstoneMostellerFull } from '@/lib/openskill'
import { MU, SIGMA, duel, duelDelta, gapCurve, player, type Outcome } from '@/lib/scenarios'

const OUTCOMES = [
  { value: 'win', label: 'A wins' },
  { value: 'draw', label: 'draw' },
  { value: 'loss', label: 'A loses' },
] as const

export function EpsilonExplorer() {
  const [epsilon, setEpsilon] = useState(0.1)
  const [gap, setGap] = useState(5)
  const [outcome, setOutcome] = useState<Outcome>('draw')

  const options = { model: thurstoneMostellerFull, epsilon }
  const result = duel(player(MU + gap), player(MU), outcome, options)

  return (
    <div className="explorer">
      <div className="controls">
        <Slider
          label="epsilon"
          value={epsilon}
          min={0}
          max={30}
          step={0.1}
          onChange={setEpsilon}
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
        <Choice label="result" value={outcome} options={OUTCOMES} onChange={setOutcome} />
      </div>
      <Chart
        title="Rating change of A against rating gap, with the selected epsilon and the default"
        series={[
          { label: `epsilon = ${fixed(epsilon, 1)}`, points: gapCurve((g) => duelDelta(g, SIGMA, outcome, options)) },
          {
            label: 'epsilon = 0.1 (default)',
            points: gapCurve((g) => duelDelta(g, SIGMA, outcome, { model: thurstoneMostellerFull })),
            dashed: true,
          },
        ]}
        xLabel="rating gap, mu of A minus mu of B"
        yLabel="change in mu of A"
        marker={{ x: gap, label: 'selected gap' }}
      />
      <Readout
        items={[
          ['change in mu of A', signed(result.deltaA)],
          ['change in mu of B', signed(result.deltaB)],
        ]}
      />
    </div>
  )
}
