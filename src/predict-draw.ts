import { flatten, sum, map, addIndex, reduce, head } from 'ramda'
import constants from './constants'
import util, { TeamRating } from './util'
import { phiMajor, phiMajorInverse } from './statistics'
import { Options, Team } from './types'

const predictDraw = (teams: Team[], options: Options = {}): number => {
  const { teamRating } = util(options)
  const { BETASQ, BETA } = constants(options)

  const totalPlayerCount = flatten(teams).length
  const drawProbability = 1 / totalPlayerCount
  const drawMargin = Math.sqrt(totalPlayerCount) * BETA * phiMajorInverse((1 + drawProbability) / 2)

  const teamRatings = map<Team, TeamRating>((team) => head<TeamRating>(teamRating([team]))!, teams)

  const pairwiseProbs: number[] = addIndex<TeamRating, number[]>(reduce<TeamRating, number[]>)(
    (outerAccum: number[], pairA: TeamRating, i: number): number[] => {
      const [muA, sigmaSqA] = pairA
      return reduce<TeamRating, number[]>(
        (innerAccum: number[], pairB: TeamRating): number[] => {
          const [muB, sigmaSqB] = pairB
          const sharedDenom = Math.sqrt(totalPlayerCount * BETASQ + sigmaSqA + sigmaSqB)
          innerAccum.push(
            phiMajor((drawMargin - muA + muB) / sharedDenom) - phiMajor((muB - muA - drawMargin) / sharedDenom)
          )
          return innerAccum
        },
        outerAccum,
        teamRatings.slice(i + 1)
      )
    },
    [],
    teamRatings
  )

  return sum(pairwiseProbs) / pairwiseProbs.length
}

export default predictDraw
