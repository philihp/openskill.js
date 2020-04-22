import models from './models'

const rate = (teams, options = {}) => {
  const model = options?.model || 'plackettLuce'
  return models[model](teams)
}

export default rate
