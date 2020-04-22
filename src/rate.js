import models from './models'

const rate = (teams, options = {}) => {
  if (options.model === undefined) {
    return models.plackettLuce(teams, options)
  }
  // const model = options?.model || 'plackettLuce'
  return models[options.model](teams, options)
}

export default rate
