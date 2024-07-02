import { sortBy, identity, range } from 'ramda'
import unwind from 'sort-unwind'

import { Rating, Options, Team } from './types'
import constants from './constants'
import { plackettLuce } from './models'

const rate = (teams: Team[], options: Options = {}): Team[] => {
  const { LIMIT_SIGMA, TAU } = constants(options)
  const { model = plackettLuce } = options
  let processedTeams = teams

  // if tau is provided, use additive dynamics factor to prevent sigma from dropping too low.
  // using this will ensure the rating will stay more pliable after many games
  if (options.tau) {
    const tauSquared = TAU * TAU
    processedTeams = teams.map((team) =>
      team.map((p) => ({
        ...p,
        sigma: Math.sqrt(p.sigma * p.sigma + tauSquared),
      }))
    )
  }

  // if rank provided, use it, otherwise transition scores and use that
  const rank = options.rank ?? options.score?.map((points) => -points) ?? range(1, teams.length + 1)

  const [orderedTeams, tenet] = unwind(rank, processedTeams)
  const newRatings = model(orderedTeams, {
    ...options,
    rank: sortBy(identity, rank),
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

  return reorderedTeams
}

export default rate
