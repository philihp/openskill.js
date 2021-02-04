import models from './models'
import { reorder } from './util'

const rate = (teams, options = {}) =>
  models[options.model || 'plackettLuce'](reorder(options.rank)(teams, options))

export default rate
