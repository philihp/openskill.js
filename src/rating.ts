import { mu as defaultMu, sigma as defaultSigma } from './constants'
import { Options, Rating } from './types'

const rating = (
  init?: { mu?: number; sigma?: number },
  options: Options = {}
): Rating => ({
  mu: init?.mu ?? defaultMu(options),
  sigma: init?.sigma ?? defaultSigma({ ...options, mu: init?.mu }),
})

export default rating
