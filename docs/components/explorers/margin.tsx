'use client'
import { useState } from 'react'
import { Chart } from '@/components/chart'
import { Slider } from '@/components/controls'
import { Readout } from '@/components/readout'
import { fixed, signed } from '@/lib/scale'
import { SIGMA, duelDelta, linspace, marginAmplification, marginDelta, type Point } from '@/lib/scenarios'

export function MarginExplorer() {
  const [margin, setMargin] = useState(10)
  const [scoreGap, setScoreGap] = useState(25)

  const gaps = linspace(0, 100, 101)
  const plain = duelDelta(0, SIGMA, 'win')

  return (
    <div className="explorer">
      <div className="controls">
        <Slider label="margin" value={margin} min={1} max={50} onChange={setMargin} />
        <Slider label="score difference" value={scoreGap} min={0} max={100} onChange={setScoreGap} />
      </div>
      <Chart
        title="Rating change of the winner against score difference"
        series={[
          { label: `margin = ${margin}`, points: gaps.map((g): Point => [g, marginDelta(g, margin)]) },
          { label: 'no margin', points: gaps.map((g): Point => [g, plain]), dashed: true },
        ]}
        xLabel="score difference"
        yLabel="change in mu of the winner"
        marker={{ x: scoreGap, label: 'selected difference' }}
      />
      <Readout
        items={[
          ['amplification factor', fixed(marginAmplification(scoreGap, margin), 3)],
          ['change in mu of the winner', signed(marginDelta(scoreGap, margin), 3)],
          ['change in mu for a plain win', signed(plain, 3)],
        ]}
      />
    </div>
  )
}
