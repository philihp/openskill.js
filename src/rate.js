import models from './models'

const rate = (teams, options = {}) =>
  models[options.model || 'plackettLuce'](teams, options)

export default rate
