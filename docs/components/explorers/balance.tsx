'use client'
import { useState } from 'react'
import { Chart } from '@/components/chart'
import { Choice, Slider } from '@/components/controls'
import { Readout } from '@/components/readout'
import { fixed, signed } from '@/lib/scale'
import { ordinal } from '@/lib/openskill'
import { MU, linspace, player, unevenTeamDeltas, type Point } from '@/lib/scenarios'

const OUTCOMES = [
  { value: 'win', label: 'the uneven team wins' },
  { value: 'loss', label: 'the uneven team loses' },
] as const

export function BalanceExplorer() {
  const [gap, setGap] = useState(10)
  const [sigma, setSigma] = useState(2)
  const [outcome, setOutcome] = useState<'win' | 'loss'>('win')

  const gaps = linspace(0, 40, 41)
  const curve = (balance: boolean): Point[] => gaps.map((g) => [g, unevenTeamDeltas(g, outcome, { balance }, sigma)[0]])
  const withBalance = unevenTeamDeltas(gap, outcome, { balance: true }, sigma)[0]
  const without = unevenTeamDeltas(gap, outcome, { balance: false }, sigma)[0]
  const bestOrdinal = ordinal(player(MU + gap / 2, sigma))

  return (
    <div className="explorer">
      <div className="controls">
        <Slider label="gap inside the team" value={gap} min={0} max={40} onChange={setGap} />
        <Slider
          label="sigma of every player"
          value={sigma}
          min={0.5}
          max={8}
          step={0.1}
          onChange={setSigma}
          format={(v) => fixed(v, 1)}
        />
        <Choice label="result" value={outcome} options={OUTCOMES} onChange={setOutcome} />
      </div>
      <Chart
        title="Rating change of each player on the uneven team against the gap inside the team"
        series={[
          { label: 'balance: true', points: curve(true) },
          { label: 'balance: false', points: curve(false), dashed: true },
        ]}
        xLabel="gap inside the team, mu of the strong player minus mu of the weak player"
        yLabel="change in mu of each player"
        marker={{ x: gap, label: 'selected gap' }}
      />
      <Readout
        items={[
          ['change in mu with balance', signed(withBalance, 3)],
          ['change in mu without balance', signed(without, 3)],
          ['ordinal of the strong player', fixed(bestOrdinal, 2)],
        ]}
      />
    </div>
  )
}
