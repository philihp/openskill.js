import models from './models'
import { reorder, transition } from './util'

const rate = (teams, options = {}) => {
  const model = models[options.model || 'plackettLuce']

  // if no rank or score provided, use natural ordering
  if (options.rank === undefined && options.score === undefined) {
    return model(teams, options)
  }

  // if rank provided, use it, otherwise transition scores and use that
  const rank = options.rank ?? options.score?.map((points) => -points)

  const [orderedTeams, orderedRanks] = reorder(rank)(teams)

  const newRatings = model(orderedTeams, {
    ...options,
    rank: orderedRanks,
  })

  const derank = transition(teams, orderedTeams)
  const [reorderedTeams] = reorder(derank)(newRatings)

  return reorderedTeams
}

export default rate
