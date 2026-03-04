import cdf from '@stdlib/stats-base-dists-normal-cdf'
import pdf from '@stdlib/stats-base-dists-normal-pdf'
import quantile from '@stdlib/stats-base-dists-normal-quantile'

export const phiMajor = (x: number) => cdf(x, 0, 1)

export const phiMajorInverse = (x: number) => quantile(x, 0, 1)

export const phiMinor = (x: number) => pdf(x, 0, 1)

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
