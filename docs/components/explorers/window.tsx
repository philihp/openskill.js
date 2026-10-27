'use client'
import { useState } from 'react'
import { Chart } from '@/components/chart'
import { Choice, Slider, Toggle } from '@/components/controls'
import { Readout } from '@/components/readout'
import { signed } from '@/lib/scale'
import { bradleyTerryPart, thurstoneMostellerPart } from '@/lib/openskill'
import { byPosition, ffaDeltas, linspace } from '@/lib/scenarios'

const MODELS = [
  { value: 'bradleyTerryPart', label: 'bradleyTerryPart' },
  { value: 'thurstoneMostellerPart', label: 'thurstoneMostellerPart' },
] as const

const modelOf = { bradleyTerryPart, thurstoneMostellerPart }

export function WindowExplorer() {
  const [players, setPlayers] = useState(10)
  const [windowSize, setWindowSize] = useState(4)
  const [useWindow, setUseWindow] = useState(true)
  const [tie, setTie] = useState(false)
  const [model, setModel] = useState<keyof typeof modelOf>('bradleyTerryPart')

  const tied = tie ? [2] : []
  const chosen = ffaDeltas(players, { model: modelOf[model], windowSize: useWindow ? windowSize : undefined }, tied)
  const adjacent = ffaDeltas(players, { model: modelOf[model] }, tied)

  return (
    <div className="explorer">
      <div className="controls">
        <Slider label="players" value={players} min={3} max={20} onChange={setPlayers} />
        <Slider label="windowSize" value={windowSize} min={0} max={19} onChange={setWindowSize} />
        <Toggle label="set windowSize" checked={useWindow} onChange={setUseWindow} />
        <Toggle label="positions 2 and 3 tie" checked={tie} onChange={setTie} />
        <Choice label="model" value={model} options={MODELS} onChange={setModel} />
      </div>
      <Chart
        title="Rating change by finishing position"
        series={[
          { label: useWindow ? `windowSize = ${windowSize}` : 'no windowSize', points: byPosition(chosen), dots: true },
          { label: 'no windowSize, for reference', points: byPosition(adjacent), dashed: true, dots: true },
        ]}
        xLabel="finishing position"
        yLabel="change in mu"
        xDomain={[1, players]}
        xTicks={linspace(1, players, players)}
      />
      <Readout
        items={[
          ['change in mu of the first player', signed(chosen[0], 3)],
          ['change in mu of the second player', signed(chosen[1], 3)],
          ['change in mu of the last player', signed(chosen[players - 1], 3)],
        ]}
      />
    </div>
  )
}
