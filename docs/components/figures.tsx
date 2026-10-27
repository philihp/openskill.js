// The static graphs on the tuning pages. These have no state, so the build
// computes them once and writes the SVG into the page.
import { Chart, type Series } from '@/components/chart'
import { fmt } from '@/lib/scale'
import {
  BETA,
  MU,
  SIGMA,
  TAU,
  alternating,
  byPosition,
  duelDelta,
  ffaDeltas,
  gapCurve,
  improvement,
  linspace,
  marginDelta,
  models,
  muSeries,
  ordinalSeries,
  player,
  playSeries,
  sigmaAfterOneGame,
  sigmaSeries,
  scaledGamma,
  streak,
  unevenTeamDeltas,
  weightedTeamDeltas,
  winProbability,
  type ModelName,
  type Point,
} from '@/lib/scenarios'
import { bradleyTerryPart, rating, thurstoneMostellerFull } from '@/lib/openskill'
import type { ReactNode } from 'react'

const BETAS = [2, BETA, 8, 12]
const TAUS = [0, TAU, 0.5, 1]
const EPSILONS = [0.1, 5, 10, 20]

const named = (name: string, value: number): string => `${name} = ${fmt(value)}`

function Figure({ children, caption }: { children: ReactNode; caption: ReactNode }) {
  return (
    <figure className="figure">
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

export function BetaWinFigure() {
  const series: Series[] = BETAS.map((beta) => ({
    label: named('beta', beta),
    points: gapCurve((gap) => winProbability(gap, 2, { beta })),
  }))
  return (
    <Figure caption="The chance that player A wins against player B, when A is rated the given gap above B. Both players have sigma = 2.">
      <Chart
        title="Win probability against rating gap, for four values of beta"
        series={series}
        xLabel="rating gap, mu of A minus mu of B"
        yLabel="chance that A wins"
        yDomain={[0, 1]}
      />
    </Figure>
  )
}

export function BetaDeltaFigure() {
  const series: Series[] = BETAS.map((beta) => ({
    label: named('beta', beta),
    points: gapCurve((gap) => duelDelta(gap, SIGMA, 'win', { beta })),
  }))
  return (
    <Figure caption="The change in mu of player A after A wins, against the rating gap. Both players have the default sigma.">
      <Chart
        title="Rating change of the winner against rating gap, for four values of beta"
        series={series}
        xLabel="rating gap, mu of A minus mu of B"
        yLabel="change in mu of A"
      />
    </Figure>
  )
}

export function TauFloorFigure() {
  const series: Series[] = TAUS.map((tau) => ({
    label: named('tau', tau),
    points: sigmaSeries(playSeries(rating(), alternating(100), { tau })),
  }))
  return (
    <Figure caption="The sigma of a new player over 100 games with alternating wins and losses. A larger tau sets a higher floor.">
      <Chart
        title="Sigma over 100 games, for four values of tau"
        series={series}
        xLabel="games played"
        yLabel="sigma"
      />
    </Figure>
  )
}

export function TauResponseFigure() {
  const series: Series[] = TAUS.map((tau) => ({
    label: named('tau', tau),
    points: muSeries(playSeries(rating(), improvement(100), { tau })),
  }))
  return (
    <Figure caption="The mu of a player who wins half of the first 50 games, then four of every five. A larger tau follows the change faster.">
      <Chart
        title="Mu over 100 games of a player whose skill rises at game 50, for four values of tau"
        series={series}
        xLabel="games played"
        yLabel="mu"
        marker={{ x: 50, label: 'skill rises' }}
      />
    </Figure>
  )
}

export function LimitSigmaFigure() {
  const start = player(MU, 1.5)
  const series: Series[] = [
    { label: 'limitSigma: false', points: sigmaSeries(playSeries(start, alternating(60), { tau: 1 })) },
    {
      label: 'limitSigma: true',
      points: sigmaSeries(playSeries(start, alternating(60), { tau: 1, limitSigma: true })),
    },
  ]
  return (
    <Figure caption="A settled player with sigma = 1.5 plays 60 games with tau = 1. Without limitSigma, sigma rises to the floor that tau sets. With it, sigma never rises.">
      <Chart
        title="Sigma of a settled player over 60 games with tau = 1, with and without limitSigma"
        series={series}
        xLabel="games played"
        yLabel="sigma"
      />
    </Figure>
  )
}

export function SigmaConvergenceFigure() {
  const series: Series[] = [2, 5, SIGMA, 15].map((sigma) => ({
    label: named('starting sigma', sigma),
    points: muSeries(playSeries(player(MU, sigma), streak(20))),
  }))
  return (
    <Figure caption="The mu of a new player who wins 20 games in a row against default opponents. A larger starting sigma moves mu faster.">
      <Chart
        title="Mu over a 20-game winning streak, for four values of the starting sigma"
        series={series}
        xLabel="games played"
        yLabel="mu"
      />
    </Figure>
  )
}

const epsilonSeries = (outcome: 'win' | 'draw'): Series[] =>
  EPSILONS.map((epsilon) => ({
    label: named('epsilon', epsilon),
    points: gapCurve((gap) => duelDelta(gap, SIGMA, outcome, { model: thurstoneMostellerFull, epsilon })),
  }))

export function EpsilonDrawFigure() {
  return (
    <Figure caption="Thurstone-Mosteller: the change in mu of player A after a draw, against the rating gap. A larger epsilon makes a draw more expected, so it moves the ratings less.">
      <Chart
        title="Rating change of player A after a draw against rating gap, for four values of epsilon"
        series={epsilonSeries('draw')}
        xLabel="rating gap, mu of A minus mu of B"
        yLabel="change in mu of A"
      />
    </Figure>
  )
}

export function EpsilonWinFigure() {
  return (
    <Figure caption="Thurstone-Mosteller: the change in mu of player A after a win. A larger epsilon makes a win a stronger signal, so it moves the ratings more.">
      <Chart
        title="Rating change of player A after a win against rating gap, for four values of epsilon"
        series={epsilonSeries('win')}
        xLabel="rating gap, mu of A minus mu of B"
        yLabel="change in mu of A"
      />
    </Figure>
  )
}

export function KappaFigure() {
  const scales = linspace(0, 30, 121)
  const series: Series[] = [0.0001, 0.01, 0.1].map((kappa) => ({
    label: named('kappa', kappa),
    points: scales.map((scale): Point => [scale, sigmaAfterOneGame(scale, { kappa })]),
  }))
  return (
    <Figure caption="The sigma of a new player after one game, against a multiplier on gamma. When the multiplier is large, kappa is the floor that stops sigma from reaching zero.">
      <Chart
        title="Sigma after one game against a gamma multiplier, for three values of kappa"
        series={series}
        xLabel="gamma multiplier"
        yLabel="sigma after one game"
      />
    </Figure>
  )
}

export function OrdinalFigure() {
  const ratings = playSeries(rating(), alternating(50))
  const series: Series[] = [0, 1, 2, 3].map((z) => ({
    label: named('z', z),
    points: ordinalSeries(ratings, { z }),
  }))
  return (
    <Figure caption="The ordinal of a new player over 50 games with alternating wins and losses. Mu stays near 25, but the ordinal rises as sigma falls.">
      <Chart
        title="Ordinal over 50 games with alternating results, for four values of z"
        series={series}
        xLabel="games played"
        yLabel="ordinal"
      />
    </Figure>
  )
}

export function BalanceFigure() {
  const gaps = linspace(0, 40, 41)
  const curve = (outcome: 'win' | 'loss', balance: boolean): Point[] =>
    gaps.map((gap) => [gap, unevenTeamDeltas(gap, outcome, { balance }, 2)[0]])
  const series: Series[] = [
    { label: 'win, balance', points: curve('win', true) },
    { label: 'win, no balance', points: curve('win', false), dashed: true },
    { label: 'loss, balance', points: curve('loss', true) },
    { label: 'loss, no balance', points: curve('loss', false), dashed: true },
  ]
  return (
    <Figure caption="A team of one strong and one weak player meets two average players. All have sigma = 2. With balance, the uneven team gains less from a win and loses more from a loss.">
      <Chart
        title="Rating change of each player on an uneven team against the gap inside the team, with and without balance"
        series={series}
        xLabel="gap inside the team, mu of the strong player minus mu of the weak player"
        yLabel="change in mu of each player"
      />
    </Figure>
  )
}

export function WeightFigure() {
  const weights = linspace(0, 3, 61)
  const series: Series[] = [
    {
      label: 'weightBounds: [1, 2]',
      points: weights.map((w): Point => [w, weightedTeamDeltas([w, 1])[0]]),
    },
    {
      label: 'weightBounds: null',
      points: weights.map((w): Point => [w, weightedTeamDeltas([w, 1], { weightBounds: null })[0]]),
      dashed: true,
    },
  ]
  return (
    <Figure caption="The change in mu of player A after a 2v2 win, against the weight of A. The weight of the teammate is 1. With the default bounds, only the order of the weights matters.">
      <Chart
        title="Rating change of player A against the weight of A, with default weight bounds and with none"
        series={series}
        xLabel="weight of player A"
        yLabel="change in mu of A"
      />
    </Figure>
  )
}

export function MarginFigure() {
  const gaps = linspace(0, 80, 81)
  const series: Series[] = [
    ...[5, 10, 20].map((margin) => ({
      label: named('margin', margin),
      points: gaps.map((gap): Point => [gap, marginDelta(gap, margin)]),
    })),
    { label: 'no margin', points: gaps.map((gap): Point => [gap, duelDelta(0, SIGMA, 'win')]), dashed: true },
  ]
  return (
    <Figure caption="The change in mu of the winner against the score difference, for three values of margin. Inside the margin, the change is the same as for a plain win.">
      <Chart
        title="Rating change of the winner against score difference, for three values of margin"
        series={series}
        xLabel="score difference"
        yLabel="change in mu of the winner"
      />
    </Figure>
  )
}

const positions = (n: number): number[] => linspace(1, n, n)

export function WindowFigure() {
  const n = 10
  const series: Series[] = [
    { label: 'no windowSize', points: byPosition(ffaDeltas(n, { model: bradleyTerryPart })), dashed: true, dots: true },
    ...[1, 2, 4, 9].map((windowSize) => ({
      label: named('windowSize', windowSize),
      points: byPosition(ffaDeltas(n, { model: bradleyTerryPart, windowSize })),
      dots: true,
    })),
  ]
  return (
    <Figure caption="Ten equal players in a free-for-all with bradleyTerryPart. Without windowSize, only the first and the last player move.">
      <Chart
        title="Rating change by finishing position in a ten-player free-for-all, for several values of windowSize"
        series={series}
        xLabel="finishing position"
        yLabel="change in mu"
        xDomain={[1, n]}
        xTicks={positions(n)}
      />
    </Figure>
  )
}

export function WindowTieFigure() {
  const n = 5
  const series: Series[] = [
    {
      label: 'no windowSize',
      points: byPosition(ffaDeltas(n, { model: bradleyTerryPart }, [2])),
      dashed: true,
      dots: true,
    },
    {
      label: named('windowSize', 4),
      points: byPosition(ffaDeltas(n, { model: bradleyTerryPart, windowSize: 4 }, [2])),
      dots: true,
    },
  ]
  return (
    <Figure caption="Five equal players, where positions 2 and 3 tie. Without windowSize, the tied players move in opposite directions. With a window that covers the game, they move the same.">
      <Chart
        title="Rating change by finishing position when positions 2 and 3 tie, with and without windowSize"
        series={series}
        xLabel="finishing position"
        yLabel="change in mu"
        xDomain={[1, n]}
        xTicks={positions(n)}
      />
    </Figure>
  )
}

export function GammaFigure() {
  const series: Series[] = [0.25, 0.5, 1, 2, 4].map((scale) => ({
    label: `gamma × ${fmt(scale)}`,
    points: sigmaSeries(playSeries(rating(), alternating(50), { gamma: scaledGamma(scale) })),
  }))
  return (
    <Figure caption="The sigma of a new player over 50 games with alternating results, with the default gamma multiplied by a constant. A larger gamma makes sigma fall faster.">
      <Chart
        title="Sigma over 50 games, for five multipliers on the default gamma"
        series={series}
        xLabel="games played"
        yLabel="sigma"
      />
    </Figure>
  )
}

export function ModelsFigure() {
  const n = 5
  const series: Series[] = (Object.keys(models) as ModelName[]).map((name) => ({
    label: name,
    points: byPosition(ffaDeltas(n, { model: models[name] })),
    dots: true,
  }))
  return (
    <Figure caption="Five equal players in a free-for-all. Each model turns the same result into a different set of rating changes.">
      <Chart
        title="Rating change by finishing position in a five-player free-for-all, for each model"
        series={series}
        xLabel="finishing position"
        yLabel="change in mu"
        xDomain={[1, n]}
        xTicks={positions(n)}
      />
    </Figure>
  )
}
