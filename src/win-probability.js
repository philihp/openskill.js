import { compose, sum, map } from 'ramda'
import { phiMajor } from './statistics'
import { betaSq } from './constants'

// This is based on Juho Snellman's comment here
// https://github.com/sublee/trueskill/issues/1#issuecomment-149762508
// which is in turn based on Jeff Moser's suggestion here
// http://www.moserware.com/2010/03/computing-your-skill.html

const meanSum = compose(
  sum,
  map((p) => p.mu)
)

const sigmaSqSum = compose(
  sum,
  map((p) => p.sigma ** 2)
)

const winProbability = ([a, b], options = {}) =>
  phiMajor(
    (meanSum(a) - meanSum(b)) /
      Math.sqrt(
        (a.length + b.length) * betaSq(options) +
          (sigmaSqSum(a) + sigmaSqSum(b))
      )
  )

export default winProbability
