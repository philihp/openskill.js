import { head, map, reduce } from 'ramda'
import constants from './constants'
import util, { TeamRating } from './util'
import { phiMajor, phiMajorInverse } from './statistics'
import { Options, Team } from './types'

const predictDraw = (teams: Team[], options: Options = {}): number => {
  const { teamRating } = util(options)
  const { BETASQ, BETA } = constants(options)

  const totalPlayerCount = reduce((acc: number, t: Team) => acc + t.length, 0, teams)
  const drawProbability = 1 / totalPlayerCount
  const drawMargin = Math.sqrt(totalPlayerCount) * BETA * phiMajorInverse((1 + drawProbability) / 2)

  const teamRatings = map<Team, TeamRating>((team) => head<TeamRating>(teamRating([team]))!, teams)

  // Sum draw-probabilities over every unordered pair (i < j). Single flat
  // accumulator instead of the previous nested reduce + intermediate array.
  const n = teamRatings.length
  let pairCount = 0
  let total = 0
  for (let i = 0; i < n; i++) {
    const [muA, sigmaSqA] = teamRatings[i]
    for (let j = i + 1; j < n; j++) {
      const [muB, sigmaSqB] = teamRatings[j]
      const sharedDenom = Math.sqrt(totalPlayerCount * BETASQ + sigmaSqA + sigmaSqB)
      total += phiMajor((drawMargin - muA + muB) / sharedDenom) - phiMajor((muB - muA - drawMargin) / sharedDenom)
      pairCount += 1
    }
  }
  return total / pairCount
}

export default predictDraw
