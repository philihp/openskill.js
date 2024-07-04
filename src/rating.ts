import constants from './constants'
import { Options, Rating } from './types'

const rating = (init?: { mu?: number; sigma?: number }, options: Options = {}): Rating => {
  const { MU: mu, SIGMA: sigma } = constants({ ...options, ...init })
  return { mu, sigma }
}

export default rating
