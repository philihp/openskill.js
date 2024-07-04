import { Options } from './types'

export default (options: Options) => {
  const z = options?.z ?? 3
  const mu = options?.mu ?? 25
  const tau = options?.tau ?? mu / 300
  const sigma = options?.sigma ?? mu / z
  const beta = options?.beta ?? sigma / 2
  const betaSq = beta ** 2
  const limitSigma = options?.limitSigma ?? options?.preventSigmaIncrease ?? false

  return {
    SIGMA: sigma,
    MU: mu,
    EPSILON: options?.epsilon ?? 0.0001,
    TWOBETASQ: 2 * betaSq,
    BETA: beta,
    BETASQ: betaSq,
    Z: z,
    TAU: tau,
    LIMIT_SIGMA: limitSigma,
  }
}
