import { mu, sigma } from './constants'

const rating = (initial) => ({
  mu: mu(initial),
  sigma: sigma(initial),
})

export default rating
