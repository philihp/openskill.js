'use client'
import { useState } from 'react'
import { Chart } from '@/components/chart'
import { Slider } from '@/components/controls'
import { Readout } from '@/components/readout'
import { fixed, signed } from '@/lib/scale'
import { MARGIN_GAP, SIGMA, duelDelta, linspace, marginDelta, marginDivisorFor, type Point } from '@/lib/scenarios'

export function MarginExplorer() {
  const [margin, setMargin] = useState(10)
  const [scoreGap, setScoreGap] = useState(25)
  const [ratingGap, setRatingGap] = useState(MARGIN_GAP)

  const gaps = linspace(0, 100, 101)
  const plain = duelDelta(ratingGap, SIGMA, 'win')

  return (
    <div className="explorer">
      <div className="controls">
        <Slider label="margin" value={margin} min={1} max={50} onChange={setMargin} />
        <Slider label="score difference" value={scoreGap} min={0} max={100} onChange={setScoreGap} />
        <Slider label="rating gap, winner minus loser" value={ratingGap} min={-20} max={20} onChange={setRatingGap} />
      </div>
      <Chart
        title="Rating change of the winner against score difference"
        series={[
          { label: `margin = ${margin}`, points: gaps.map((g): Point => [g, marginDelta(g, margin, ratingGap)]) },
          { label: 'no margin', points: gaps.map((g): Point => [g, plain]), dashed: true },
        ]}
        xLabel="score difference"
        yLabel="change in mu of the winner"
        marker={{ x: scoreGap, label: 'selected difference' }}
      />
      <Readout
        items={[
          ['divisor', fixed(marginDivisorFor(scoreGap, margin), 3)],
          ['change in mu of the winner', signed(marginDelta(scoreGap, margin, ratingGap), 3)],
          ['change in mu for a plain win', signed(plain, 3)],
        ]}
      />
    </div>
  )
}
