'use client'
import { useState } from 'react'
import { Chart } from '@/components/chart'
import { Slider, Toggle } from '@/components/controls'
import { Readout } from '@/components/readout'
import { fixed, signed } from '@/lib/scale'
import { normalize } from '@/lib/openskill'
import { linspace, weightedTeamDeltas, type Point } from '@/lib/scenarios'

export function WeightExplorer() {
  const [weightA, setWeightA] = useState(1.5)
  const [weightB, setWeightB] = useState(1)
  const [useBounds, setUseBounds] = useState(true)
  const [low, setLow] = useState(1)
  const [high, setHigh] = useState(2)

  const bounds: [number, number] = [Math.min(low, high), Math.max(low, high)]
  const options = { weightBounds: useBounds ? bounds : null }
  const curve = (opts: typeof options): Point[] =>
    linspace(0, 3, 61).map((w) => [w, weightedTeamDeltas([w, weightB], opts)[0]])
  const [deltaA, deltaB] = weightedTeamDeltas([weightA, weightB], options)
  const applied = useBounds ? normalize([weightA, weightB], bounds[0], bounds[1]) : [weightA, weightB]

  return (
    <div className="explorer">
      <div className="controls">
        <Slider
          label="weight of A"
          value={weightA}
          min={0}
          max={3}
          step={0.05}
          onChange={setWeightA}
          format={(v) => fixed(v, 2)}
        />
        <Slider
          label="weight of the teammate B"
          value={weightB}
          min={0}
          max={3}
          step={0.05}
          onChange={setWeightB}
          format={(v) => fixed(v, 2)}
        />
        <Toggle label="normalize with weightBounds" checked={useBounds} onChange={setUseBounds} />
        <Slider
          label="lower bound"
          value={low}
          min={0}
          max={3}
          step={0.1}
          onChange={setLow}
          format={(v) => fixed(v, 1)}
        />
        <Slider
          label="upper bound"
          value={high}
          min={0}
          max={4}
          step={0.1}
          onChange={setHigh}
          format={(v) => fixed(v, 1)}
        />
      </div>
      <Chart
        title="Rating change of A against the weight of A"
        series={[
          {
            label: useBounds ? `weightBounds: [${fixed(bounds[0], 1)}, ${fixed(bounds[1], 1)}]` : 'weightBounds: null',
            points: curve(options),
          },
          { label: 'raw weights, for reference', points: curve({ weightBounds: null }), dashed: true },
        ]}
        xLabel="weight of player A"
        yLabel="change in mu of A"
        marker={{ x: weightA, label: 'selected weight' }}
      />
      <Readout
        items={[
          ['weights applied to A and B', `${fixed(applied[0], 2)} and ${fixed(applied[1], 2)}`],
          ['change in mu of A', signed(deltaA, 3)],
          ['change in mu of B', signed(deltaB, 3)],
        ]}
      />
    </div>
  )
}
