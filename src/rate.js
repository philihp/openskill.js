import models from './models'
import { reorder } from './util'

// finds the indexes used to unshuffle, O(n^2)
// [ 1, 3, 4, 2 ] --> [ 1, 4, 2, 3 ]
const reversedOrder = (rank) => {
  return rank.map((n, i) => {
    const j = rank.indexOf(i + 1) + 1
    return j
  })
}

const rate = (teams, options = {}) => {
  const model = models[options.model || 'plackettLuce']

  // if no rank or score provided, use natural ordering
  if (options.rank === undefined && options.score === undefined) {
    return model(teams, options)
  }

  // if rank provided, use it, otherwise invert scores and use that
  const rank = options.rank ?? options.score.map((points) => -points)
  const [orderedTeams, orderedRanks] = reorder(rank)(teams)

  const newRatings = model(orderedTeams, {
    ...options,
    rank: orderedRanks,
  })

  const derank = reversedOrder(rank)
  const [reorderedTeams] = reorder(derank)(newRatings)
  return reorderedTeams
}

export default rate
