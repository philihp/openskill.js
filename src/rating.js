import { mu as defaultMu, sigma as defaultSigma } from './constants'

const rating = ({ mu, sigma }, options = {}) => ({
  mu: mu ?? defaultMu(options),
  sigma: sigma ?? defaultSigma(options),
})

export default rating
