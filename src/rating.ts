import { mu as defaultMu, sigma as defaultSigma } from './constants'
import { Rating } from './types'

const rating = (init?: Rating, options = {}) => ({
  mu: init?.mu ?? defaultMu(options),
  sigma: init?.sigma ?? defaultSigma({ ...options, mu: init?.mu }),
})

export default rating
