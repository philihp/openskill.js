import models from './models'
import { reorder } from './util'

const rate = (teams, options = {}) => {
  const model = models[options.model || 'plackettLuce']

  if (options.rank === undefined) {
    return model(teams, options)
  }

  const [orderedTeams, orderedRanks] = reorder(options.rank)(teams)

  return model(orderedTeams, {
    ...options,
    rank: orderedRanks,
  })
}

export default rate
