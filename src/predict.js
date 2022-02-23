import { sum } from 'ramda'
import constants from './constants'
import util from './util'
import { phiMajor } from './statistics'

const predict = (teams, options = {}) => {
  const n = teams.length
  const { teamRating } = util(options)
  const { BETASQ } = constants(options)

  const teamRatings = teamRating(teams)

  // pair each team with every other team
  const pairs = teamRatings.map(([muA, sigmaSqA], i) =>
    [...teamRatings.slice(0, i), ...teamRatings.slice(i + 1)].map(
      ([muB, sigmaSqB]) => {
        // and run this sorcery
        return phiMajor(
          (muA - muB) / Math.sqrt(n * BETASQ + sigmaSqA ** 2 + sigmaSqB ** 2)
        )
      }
    )
  )

  // 1, 3, 6, 10, ...
  const denom = (n * (n - 1)) / 2
  return pairs.map((pair) => sum(pair) / denom)
}

export default predict
