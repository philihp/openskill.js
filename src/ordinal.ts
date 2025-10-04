import constants from './constants'
import { Rating, Options } from './types'

/**
 * Compute a conservative "ordinal" skill estimate:
 *   α · [ (μ − z·σ) + target / α ]
 *
 * alpha: scales the entire metric.
 * target: shifts the baseline toward a desired floor/goal.
 * options.Z: controls how many standard deviations below μ you want
 *            (3 ⇒ ≈ 99.7 % confidence).
 */
const ordinal = (rating: Rating, options: Options = {}): number => {
  const { sigma, mu } = rating
  const { Z, ALPHA, TARGET } = constants(options)
  return TARGET + ALPHA * (mu - Z * sigma)
}

export default ordinal
