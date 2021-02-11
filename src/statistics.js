import gaussian from 'gaussian'

// use a standard normal distribution - mean of zero, stddev/variance of one
const normal = gaussian(0, 1)

export const phiMajor = (x) => normal.cdf(x)

export const phiMinor = (x) => normal.pdf(x)

export const v = (x, t) => {
  const xt = x - t
  const denom = phiMajor(xt)
  return denom < Number.EPSILON ? -xt : phiMinor(xt) / denom
}

export const w = (x, t) => {
  const xt = x - t
  const denom = phiMajor(xt)
  if (denom < Number.EPSILON) {
    return x < 0 ? 1 : 0
  }
  return v(x, t) * (v(x, t) + xt)
}

const VT = () => {
  return (x, t) => {
    const xx = Math.abs(x)
    const b = phiMajor(t - xx) - phiMajor(-t - xx)
    if (b < 1e-5) {
      if (x < 0) return -x - t
      return -x + t
    }
    const a = phiMinor(-t - xx) - phiMinor(t - xx)
    return (x < 0 ? -a : a) / b
  }
}

const WT = (options) => {
  const vt = VT(options)
  return (x, t) => {
    const xx = Math.abs(x)
    const b = phiMajor(t - xx) - phiMajor(-t - xx)
    return b < Number.EPSILON
      ? 1.0
      : ((t - xx) * phiMinor(t - xx) + (t + xx) * phiMinor(-t - xx)) / b +
          vt(x, t) * vt(x, t)
  }
}

export default (options) => ({
  vt: VT(options),
  wt: WT(options),
})
