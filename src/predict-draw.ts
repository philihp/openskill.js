import { filter, head, map, range, reduce, xprod } from 'ramda'
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

  // Sum draw-probabilities over every unordered pair (i < j) — single flat
  // reduce over the upper-triangle pair list instead of the previous nested
  // reduce + intermediate `pairwiseProbs` array.
  const idx = range(0, teamRatings.length)
  const pairs = filter(([i, j]: number[]) => i < j, xprod(idx, idx))
  const { total, count } = reduce(
    (acc: { total: number; count: number }, [i, j]: number[]) => {
      const [muA, sigmaSqA] = teamRatings[i]
      const [muB, sigmaSqB] = teamRatings[j]
      const sharedDenom = Math.sqrt(totalPlayerCount * BETASQ + sigmaSqA + sigmaSqB)
      acc.total += phiMajor((drawMargin - muA + muB) / sharedDenom) - phiMajor((muB - muA - drawMargin) / sharedDenom)
      acc.count += 1
      return acc
    },
    { total: 0, count: 0 },
    pairs
  )
  return total / count
}

export default predictDraw
