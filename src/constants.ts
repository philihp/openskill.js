import { Options } from './types'

const z = (options: Options) => options?.z ?? 3
export const mu = (options: Options) => options?.mu ?? 25
const tau = (options: Options) => options?.tau ?? mu(options) / 300
export const sigma = (options: Options) => options?.sigma ?? mu(options) / z(options)

const epsilon = (options: Options) => options?.epsilon ?? 0.0001
const beta = (options: Options) => options?.beta ?? sigma(options) / 2
const betaSq = (options: Options) => beta(options) ** 2
const limitSigma = (options: Options) => options?.limitSigma ?? options?.preventSigmaIncrease ?? false

export default (options: Options) => ({
  EPSILON: epsilon(options),
  TWOBETASQ: 2 * betaSq(options),
  BETA: beta(options),
  BETASQ: betaSq(options),
  Z: z(options),
  TAU: tau(options),
  LIMIT_SIGMA: limitSigma(options),
})
