import { sortBy, identity, range } from 'ramda'
import { unwind } from 'sort-unwind'

import { Rating, Options, Teams, RateResult } from './types'
import constants from './constants'
import { normalize } from './util'
import { plackettLuce } from './models'

const rate = <const T extends Teams>(teams: T, options: Options = {}): RateResult<T> => {
  const { LIMIT_SIGMA, TAU, WEIGHT_BOUNDS } = constants(options)
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

  // weights enable partial play: a player's rating update is scaled by their
  // contribution to the team. By default each team's weights are normalized into
  // WEIGHT_BOUNDS ([1, 2]), so only relative differences within a team matter —
  // matching openskill.py. Pass weightBounds: null to apply the raw weights as-is.
  const normalizedWeight =
    options.weight && WEIGHT_BOUNDS
      ? options.weight.map((teamWeight) => normalize(teamWeight, WEIGHT_BOUNDS[0], WEIGHT_BOUNDS[1]))
      : options.weight

  const [orderedTeams, tenet] = unwind(rank, processedTeams)
  // reorder weights with the same rank permutation so they stay aligned with the
  // teams the model receives in rank-sorted order
  const orderedWeight = normalizedWeight ? unwind(rank, normalizedWeight)[0] : undefined
  // reorder scores the same way. Each model uses them with margin, as
  // openskill.py does, to scale the difference in mu between two teams.
  const orderedScore = options.score ? unwind(rank, options.score)[0] : undefined
  const newRatings = model(orderedTeams, {
    ...options,
    rank: sortBy(identity, rank),
    score: orderedScore,
    weight: orderedWeight,
  })
  let [reorderedTeams] = unwind(tenet, newRatings)

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

  return reorderedTeams as RateResult<T>
}

export default rate
