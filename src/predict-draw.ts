import { flatten, sum, map, addIndex, reduce } from 'ramda'
import constants from './constants'
import util, { TeamRating } from './util'
import { phiMajor, phiMajorInverse } from './statistics'
import { Options, Team } from './types'

const predictDraw = (teams: Team[], options: Options = {}): number => {
  const { teamRating } = util(options)
  const { BETASQ, BETA } = constants(options)

  if (teams.length === 0) return 1

  const totalPlayerCount = flatten(teams).length
  const drawProbability = 1 / totalPlayerCount
  const drawMargin = Math.sqrt(totalPlayerCount) * BETA * phiMajorInverse((1 + drawProbability) / 2)

  const teamRatings = map<Team, TeamRating>((team) => teamRating([team])[0], teams)

  const pairwiseProbs: number[] = addIndex<TeamRating, number[]>(reduce<TeamRating, number[]>)(
    (qqq: number[], pairA: TeamRating, i: number): number[] => {
      const [muA, sigmaSqA] = pairA
      return reduce<TeamRating, number[]>(
        (ppp: number[], pairB: TeamRating): number[] => {
          const [muB, sigmaSqB] = pairB
          const sharedDenom = Math.sqrt(totalPlayerCount * BETASQ + sigmaSqA + sigmaSqB)
          ppp.push(phiMajor((drawMargin - muA + muB) / sharedDenom) - phiMajor((muB - muA - drawMargin) / sharedDenom))
          return ppp
        },
        qqq,
        teamRatings.slice(i + 1)
      )
    },
    [],
    teamRatings
  )

  return sum(pairwiseProbs) / pairwiseProbs.length
}

export default predictDraw
