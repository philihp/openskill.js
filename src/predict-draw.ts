import { flatten } from 'ramda'
import constants from './constants'
import util, { sum } from './util'
import { phiMajor, phiMajorInverse } from './statistics'
import { Options, Team } from './types'

const predictWin = (teams: Team[], options: Options = {}) => {
  const { teamRating } = util(options)
  const { BETASQ, BETA } = constants(options)

  const n = teams.length
  if (n === 0) return undefined
  if (n === 1) return 1

  const denom = (n * (n - 1)) / (n > 2 ? 1 : 2)
  const teamRatings = teamRating(teams)
  const drawMargin = Math.sqrt(flatten(teams).length) * BETA * phiMajorInverse((1 + 1 / n) / 2)

  return (
    Math.abs(
      teamRatings
        .map(([muA, sigmaSqA], i) =>
          teamRatings
            .filter((_, q) => i !== q)
            .map(([muB, sigmaSqB]) => {
              const sigmaBar = Math.sqrt(n * BETASQ + sigmaSqA + sigmaSqB)
              return phiMajor((drawMargin - muA + muB) / sigmaBar) - phiMajor((muA - muB - drawMargin) / sigmaBar)
            })
        )
        .flat()
        .reduce(sum, 0)
    ) / denom
  )
}

export default predictWin
