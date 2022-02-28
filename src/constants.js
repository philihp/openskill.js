export const z = (options) => options?.z ?? 3
export const mu = (options) => options?.mu ?? 25
export const sigma = (options) => options?.sigma ?? mu(options) / z(options)

export const epsilon = (options) => options?.epsilon ?? 0.0001
export const beta = (options) => options?.beta ?? sigma(options) / 2
export const betaSq = (options) => beta(options) ** 2

export default (options) => ({
  EPSILON: epsilon(options),
  TWOBETASQ: 2 * betaSq(options),
  BETA: beta(options),
  BETASQ: betaSq(options),
  Z: z(options),
})
