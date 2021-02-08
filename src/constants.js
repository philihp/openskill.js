export const z = (options) => options?.z ?? 3
export const mu = (options) => options?.mu ?? 25
export const epsilon = (options) => options?.epsilon ?? 0.0001

export const sigma = (options) => options?.sigma ?? mu(options) / z(options)
export const beta = (options) => options?.beta ?? sigma(options) / 2
export const betaSq = (options) => beta(options) * beta(options)

export default (options) => ({
  EPSILON: epsilon(options),
  TWOBETASQ: 2 * betaSq(options),
})
