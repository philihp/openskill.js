import { sortBy, identity } from 'ramda'
import unwind from 'sort-unwind'
import models from './models'

const rate = (teams, options = {}) => {
  const model = models[options.model || 'plackettLuce']

  // if no rank or score provided, use natural ordering
  if (options.rank === undefined && options.score === undefined) {
    return model(teams, options)
  }

  // if rank provided, use it, otherwise transition scores and use that
  const rank = options.rank ?? options.score?.map((points) => -points)

  const [orderedTeams, tenet] = unwind(rank, teams)
  const newRatings = model(orderedTeams, {
    ...options,
    rank: sortBy(identity, rank),
  })
  const [reorderedTeams] = unwind(tenet, newRatings)

  return reorderedTeams
}

export default rate
