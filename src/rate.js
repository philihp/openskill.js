import models from './models'
import { reorder } from './util'

const rate = (teams, options = {}) =>
  models[options.model || 'plackettLuce'](reorder(options.rank)(teams))

export default rate
