import constants from './constants'
import util, { TeamRating } from './util'
import { phiMajor } from './statistics'
import { Options, Team } from './types'
import { addIndex, flatten, range, reduce, sum } from 'ramda'

const predictWin = (teams: Team[], options: Options = {}): number[] => {
  const { teamRating } = util(options)
  const { BETASQ } = constants(options)

  const teamRatings = teamRating(teams)
  const n = teams.length
  const totalPlayerCount = flatten(teams).length

  if (n === 2) {
    const [[aMu, aSigmaSq], [bMu, bSigmaSq]] = teamRatings
    const result = phiMajor((aMu - bMu) / Math.sqrt(totalPlayerCount * BETASQ + aSigmaSq + bSigmaSq))
    return [result, 1 - result]
  }

  const pairwiseProbs: number[] = addIndex<TeamRating, number[]>(reduce<TeamRating, number[]>)(
    (outerAccum: number[], pairA: TeamRating, i: number): number[] => {
      const [muA, aSigmaSq] = pairA
      return reduce<TeamRating, number[]>(
        (innerAccum: number[], pairB: TeamRating): number[] => {
          const [muB, bSigmaSq] = pairB
          innerAccum.push(phiMajor((muA - muB) / Math.sqrt(totalPlayerCount * BETASQ + aSigmaSq + bSigmaSq)))
          return innerAccum
        },
        outerAccum,
        teamRatings.slice(i + 1)
      )
    },
    [],
    teamRatings
  )

  const winProbabilities: number[] = []
  range(0, n).map((i: number) => {
    const teamWinProbability = sum(range(i * (n - 1), (i + 1) * (n - 1)).map((j: number) => pairwiseProbs[j])) / (n - 1)
    winProbabilities.push(teamWinProbability)
  })

  const totalProbability = sum(winProbabilities)

  return winProbabilities.map<number, number>((winProb: number) => {
    return winProb / totalProbability
  })
}

export default predictWin
