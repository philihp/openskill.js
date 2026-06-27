import { Options } from './types'

const builder = (options: Options) => {
  // i'd love to know of a better way to do this
  const { z = 3, mu = 25, epsilon = 0.1, alpha = 1, target = 0 } = options
  const { tau = 25 / 300, sigma = 25 / 3, beta = 25 / 6, limitSigma = false } = options
  const { balance = false, kappa = 0.0001, weightBounds = [1, 2] as [number, number] } = options
  const betaSq = beta ** 2

  return {
    SIGMA: sigma,
    MU: mu,
    EPSILON: epsilon,
    TWOBETASQ: 2 * betaSq,
    BETA: beta,
    BETASQ: betaSq,
    Z: z,
    ALPHA: alpha,
    TARGET: target,
    TAU: tau,
    LIMIT_SIGMA: limitSigma,
    BALANCE: balance,
    KAPPA: kappa,
    WEIGHT_BOUNDS: weightBounds,
  }
}

export default builder
