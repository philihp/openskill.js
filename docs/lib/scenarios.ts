// Deterministic match scenarios behind the tuning graphs. Every function here
// is pure: the same inputs always draw the same graph, with no randomness.
import {
  rate,
  rating,
  ordinal,
  predictWin,
  marginFactor,
  plackettLuce,
  bradleyTerryFull,
  bradleyTerryPart,
  thurstoneMostellerFull,
  thurstoneMostellerPart,
  type Gamma,
  type Model,
  type Options,
  type Rating,
  type Team,
} from './openskill'

export type Point = readonly [number, number]

export const MU = 25
export const SIGMA = 25 / 3
export const BETA = 25 / 6
export const TAU = 25 / 300

export const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i)

export const linspace = (min: number, max: number, count: number): number[] =>
  range(count).map((i) => min + ((max - min) * i) / (count - 1))

export const player = (mu: number, sigma: number = SIGMA): Rating => ({ mu, sigma })

export const models = {
  plackettLuce,
  bradleyTerryFull,
  bradleyTerryPart,
  thurstoneMostellerFull,
  thurstoneMostellerPart,
} as const

export type ModelName = keyof typeof models

export const modelOf = (name: ModelName): Model => models[name]

// --- one match -------------------------------------------------------------

export type Outcome = 'win' | 'loss' | 'draw'

const rankFor: Record<Outcome, [number, number]> = { win: [1, 2], loss: [2, 1], draw: [1, 1] }

/** Player `a` meets player `b` once. `outcome` is from a's point of view. */
export const duel = (a: Rating, b: Rating, outcome: Outcome, options: Options = {}) => {
  const [[a2], [b2]] = rate([[a], [b]], { ...options, rank: rankFor[outcome] })
  return { a: a2, b: b2, deltaA: a2.mu - a.mu, deltaB: b2.mu - b.mu }
}

/** The change in mu of a player rated `gap` above a default opponent. */
export const duelDelta = (gap: number, sigma: number, outcome: Outcome, options: Options = {}): number =>
  duel(player(MU + gap, sigma), player(MU, sigma), outcome, options).deltaA

/** The chance that a player rated `gap` above a default opponent wins. */
export const winProbability = (gap: number, sigma: number, options: Options = {}): number =>
  predictWin([[player(MU + gap, sigma)], [player(MU, sigma)]], options)[0]

/** Samples `fn` across a range of rating gaps. */
export const gapCurve = (fn: (gap: number) => number, min = -30, max = 30, count = 61): Point[] =>
  linspace(min, max, count).map((gap) => [gap, fn(gap)])

// --- a series of matches ---------------------------------------------------

/** `n` results that alternate win, loss, win, loss ... */
export const alternating = (n: number): Outcome[] => range(n).map((i) => (i % 2 === 0 ? 'win' : 'loss'))

/** `n` wins in a row. */
export const streak = (n: number): Outcome[] => range(n).map(() => 'win')

/**
 * A player who improves half way: alternating results for the first half,
 * then four wins in every five.
 */
export const improvement = (n: number): Outcome[] =>
  range(n).map((i) => (i < n / 2 ? (i % 2 === 0 ? 'win' : 'loss') : i % 5 === 4 ? 'loss' : 'win'))

export const patterns = { alternating, streak, improvement } as const

export type PatternName = keyof typeof patterns

/**
 * Plays `results` in order, each against a fresh copy of `opponent`, so the
 * opponent never drifts. Returns the rating before each game and after the
 * last one, so index 0 is the start.
 */
export const playSeries = (
  start: Rating,
  results: Outcome[],
  options: Options = {},
  opponent: () => Rating = rating
): Rating[] =>
  results.reduce(
    (acc, outcome) => {
      acc.push(duel(acc[acc.length - 1], opponent(), outcome, options).a)
      return acc
    },
    [start]
  )

export const toSeries = (ratings: Rating[], pick: (r: Rating) => number): Point[] => ratings.map((r, i) => [i, pick(r)])

export const muSeries = (ratings: Rating[]): Point[] => toSeries(ratings, (r) => r.mu)

export const sigmaSeries = (ratings: Rating[]): Point[] => toSeries(ratings, (r) => r.sigma)

export const ordinalSeries = (ratings: Rating[], options: Options = {}): Point[] =>
  toSeries(ratings, (r) => ordinal(r, options))

// --- teams -----------------------------------------------------------------

/** `team` beats `foes`. Returns the change in mu of each player on `team`. */
export const teamWinDeltas = (team: Team, foes: Team, options: Options = {}): number[] => {
  const [after] = rate([team, foes], options)
  return after.map((p, i) => p.mu - team[i].mu)
}

/**
 * A team of one strong and one weak player, `gap` apart around the default
 * mu, meets two players at the default mu. All four share `sigma`. Returns
 * the change in mu of the strong and the weak player.
 */
export const unevenTeamDeltas = (
  gap: number,
  outcome: 'win' | 'loss',
  options: Options = {},
  sigma: number = SIGMA
): number[] => {
  const team = [player(MU + gap / 2, sigma), player(MU - gap / 2, sigma)]
  const foes = [player(MU, sigma), player(MU, sigma)]
  const [first, second] = outcome === 'win' ? rate([team, foes], options) : rate([foes, team], options)
  const after = outcome === 'win' ? first : second
  return after.map((p, i) => p.mu - team[i].mu)
}

/** The sigma of a default player after one win, under a scaled gamma. */
export const sigmaAfterOneGame = (gammaScale: number, options: Options = {}): number =>
  duel(rating(), rating(), 'win', { ...options, gamma: scaledGamma(gammaScale) }).a.sigma

/** Two default players with the given weights beat two default players. */
export const weightedTeamDeltas = (weights: [number, number], options: Options = {}): number[] =>
  teamWinDeltas([rating(), rating()], [rating(), rating()], { ...options, weight: [weights, [1, 1]] })

// --- scores ----------------------------------------------------------------

/** A default player beats another by `scoreGap` points. */
export const marginDelta = (scoreGap: number, margin: number): number =>
  duel(rating(), rating(), 'win', { score: [scoreGap, 0], margin }).deltaA

export const marginAmplification = (scoreGap: number, margin: number): number => marginFactor([scoreGap, 0], 0, margin)

// --- free-for-all ----------------------------------------------------------

/**
 * `n` default players finish in order 1..n. Positions listed in `tiedWith`
 * share the rank of the position before them (0-based). Returns the change in
 * mu by finishing position.
 */
export const ffaDeltas = (n: number, options: Options = {}, tied: number[] = []): number[] => {
  const players = range(n).map(() => rating())
  const rank = range(n).reduce<number[]>((acc, i) => {
    acc.push(tied.includes(i) && i > 0 ? acc[i - 1] : i + 1)
    return acc
  }, [])
  const after = rate(
    players.map((p) => [p]),
    { ...options, rank }
  )
  return after.map(([p], i) => p.mu - players[i].mu)
}

export const byPosition = (deltas: number[]): Point[] => deltas.map((d, i) => [i + 1, d])

// --- gamma -----------------------------------------------------------------

/** The default gamma, sigma / c, scaled by a constant. */
export const scaledGamma =
  (scale: number): Gamma =>
  (c, _k, _mu, sigmaSq) =>
    (scale * Math.sqrt(sigmaSq)) / c
