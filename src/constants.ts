import { Options } from './types'

export type Constants = {
  SIGMA: number
  MU: number
  EPSILON: number
  TWOBETASQ: number
  BETA: number
  BETASQ: number
  Z: number
  ALPHA: number
  TARGET: number
  TAU: number
  LIMIT_SIGMA: boolean
  BALANCE: boolean
  KAPPA: number
  WEIGHT_BOUNDS: [number, number] | null
  WINDOW_SIZE: number | undefined
}

const builder = (options: Options): Constants => {
  // i'd love to know of a better way to do this
  const { z = 3, mu = 25, epsilon = 0.1, alpha = 1, target = 0 } = options
  const { tau = 25 / 300, sigma = 25 / 3, beta = 25 / 6, limitSigma = false } = options
  const { balance = false, kappa = 0.0001, weightBounds = [1, 2] as [number, number] } = options
  const { windowSize } = options
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
    // undefined keeps the 5.x adjacent pairing in the partial models. A number
    // is truncated like openskill.py's int(window_size).
    WINDOW_SIZE: windowSize === undefined ? undefined : Math.trunc(windowSize),
  }
}

export default builder
