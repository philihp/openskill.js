import { plackettLuce } from './models'
import { Options } from './types'

export const z = (options: Options) => options?.z ?? 3
export const mu = (options: Options) => options?.mu ?? 25
export const tau = (options: Options) => options?.tau ?? mu(options) / 300
export const sigma = (options: Options) => options?.sigma ?? mu(options) / z(options)

export const epsilon = (options: Options) => options?.epsilon ?? 0.0001
export const beta = (options: Options) => options?.beta ?? sigma(options) / 2
export const betaSq = (options: Options) => beta(options) ** 2
export const limitSigma = (options: Options) => options?.limitSigma ?? options?.preventSigmaIncrease ?? false
export const model = (options: Options) => options?.model ?? plackettLuce

export default (options: Options) => ({
  EPSILON: epsilon(options),
  TWOBETASQ: 2 * betaSq(options),
  BETA: beta(options),
  BETASQ: betaSq(options),
  Z: z(options),
  TAU: tau(options),
  LIMIT_SIGMA: limitSigma(options),
})
