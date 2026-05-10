import erf from '@stdlib/math-base-special-erf'
import quantile from '@stdlib/stats-base-dists-normal-quantile'

const SQRT_2 = Math.sqrt(2.0)
const SQRT_TAU = Math.sqrt(2.0 * Math.PI)

// Standard-normal CDF, matching CPython's statistics.NormalDist.cdf:
//   0.5 * (1 + erf((x - mu) / (sigma * sqrt(2))))
// At mu=0, sigma=1 this collapses to 0.5 * (1 + erf(x / sqrt(2))).
export const phiMajor = (x: number) => 0.5 * (1.0 + erf(x / SQRT_2))

export const phiMajorInverse = (x: number) => quantile(x, 0, 1)

// Standard-normal PDF, matching CPython's statistics.NormalDist.pdf:
//   exp((x - mu)**2 / (-2*variance)) / sqrt(tau*variance)
// At mu=0, sigma=1 this collapses to exp(x*x / -2) / sqrt(2*pi).
export const phiMinor = (x: number) => Math.exp((x * x) / -2.0) / SQRT_TAU

export const v = (x: number, t: number) => {
  const xt = x - t
  const denom = phiMajor(xt)
  return denom < Number.EPSILON ? -xt : phiMinor(xt) / denom
}

export const w = (x: number, t: number) => {
  const xt = x - t
  const denom = phiMajor(xt)
  if (denom < Number.EPSILON) {
    return x < 0 ? 1 : 0
  }
  return v(x, t) * (v(x, t) + xt)
}

export const vt = (x: number, t: number) => {
  const xx = Math.abs(x)
  const b = phiMajor(t - xx) - phiMajor(-t - xx)
  if (b < 1e-5) {
    if (x < 0) return -x - t
    return -x + t
  }
  const a = phiMinor(-t - xx) - phiMinor(t - xx)
  return (x < 0 ? -a : a) / b
}

export const wt = (x: number, t: number) => {
  const xx = Math.abs(x)
  const b = phiMajor(t - xx) - phiMajor(-t - xx)
  return b < Number.EPSILON
    ? 1.0
    : ((t - xx) * phiMinor(t - xx) + (t + xx) * phiMinor(-t - xx)) / b + vt(x, t) * vt(x, t)
}
