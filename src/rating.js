const DEFAULT_MU = 25.0
const DEFAULT_SIGMA = DEFAULT_MU / 3.0

const rating = (initial) => ({
  mu: initial?.mu || DEFAULT_MU,
  sigma: initial?.sigma || DEFAULT_SIGMA,
})

export default rating
