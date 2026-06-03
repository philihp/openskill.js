import { sortBy, identity, range } from 'ramda'
import { unwind } from 'sort-unwind'

import { Rating, Options, Teams, RateResult } from './types'
import constants from './constants'
import { marginFactor } from './margin'
import { plackettLuce } from './models'

const rate = <const T extends Teams>(teams: T, options: Options = {}): RateResult<T> => {
  const { LIMIT_SIGMA, TAU } = constants(options)
  const { model = plackettLuce } = options

  // tau adds an additive dynamics factor that keeps sigma from dropping too low,
  // matching openskill.py which always applies sqrt(sigma^2 + tau^2). When TAU=0
  // this is a no-op.
  const tauSquared = TAU * TAU
  const processedTeams = teams.map((team) =>
    team.map((p) => ({
      ...p,
      sigma: Math.sqrt(p.sigma * p.sigma + tauSquared),
    }))
  )

  // if rank provided, use it, otherwise transition scores and use that
  const rank = options.rank ?? options.score?.map((points) => -points) ?? range(1, teams.length + 1)

  const [orderedTeams, tenet] = unwind(rank, processedTeams)
  const newRatings = model(orderedTeams, {
    ...options,
    rank: sortBy(identity, rank),
  })
  let [reorderedTeams] = unwind(tenet, newRatings)

  // margin amplifies rating updates when scores are provided and a team's score differs
  // from opponents by more than the margin threshold. Larger victory margins yield
  // proportionally larger mu changes via log1p, while differences within the margin
  // are treated as ordinary wins/losses.
  if (options.score && options.margin) {
    const scores = options.score
    const margin = options.margin
    reorderedTeams = reorderedTeams.map((team: Rating[], i: number) => {
      const factor = marginFactor(scores, i, margin)
      return team.map((p: Rating, k: number) => {
        const priorMu = processedTeams[i][k].mu
        return { mu: priorMu + factor * (p.mu - priorMu), sigma: p.sigma }
      })
    })
  }

  // limitSigma prevents sigma from ever going up which can happen when using a tau value.
  // this helps prevent ordinal from ever dropping after winning a game which can feel unfair
  if (TAU && LIMIT_SIGMA) {
    reorderedTeams = reorderedTeams.map((team: Rating[], i: number) =>
      team.map((p, j) => ({
        ...p,
        sigma: Math.min(p.sigma, teams[i][j].sigma),
      }))
    )
  }

  // the runtime always returns teams matching the input shape; the cast bridges
  // the dynamically built Team[] to the statically inferred RateResult<T>.
  return reorderedTeams as RateResult<T>
}

export default rate
