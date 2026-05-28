import { zip } from 'ramda'
import util, { ladderPairs, marginDivisor } from '../util'
import { w, v, vt, wt } from '../statistics'
import constants from '../constants'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, EPSILON } = constants(options)
  const { margin = 0, score: scoreArr } = options
  const { teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)
  const adjacentTeams = ladderPairs(teamRatings)

  const divisor = (i: number, q: number): number => marginDivisor(scoreArr!, margin, i, q)

  return zip(teamRatings, adjacentTeams).map(([iTeamRating, iAdjacents], i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const [iOmega, iDelta] = iAdjacents.reduce(
      ([omega, delta], [qMu, qSigmaSq, _qTeam, qRank], q) => {
        const ciq = 2 * Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
        const deltaMu = (iMu - qMu) / ciq
        const sigSqToCiq = iSigmaSq / ciq
        const iGamma = gamma(ciq, teamRatings.length, ...iTeamRating)

        // find original team index for score-indexed divisor
        const qIdx = teamRatings.indexOf(iAdjacents[q])
        const adjustedDeltaMu = deltaMu / divisor(i, qIdx)

        if (qRank === iRank) {
          return [
            omega + sigSqToCiq * vt(adjustedDeltaMu, EPSILON / ciq),
            delta + ((iGamma * sigSqToCiq) / ciq) * wt(adjustedDeltaMu, EPSILON / ciq),
          ]
        }

        const sign = qRank > iRank ? 1 : -1
        return [
          omega + sign * sigSqToCiq * v(sign * adjustedDeltaMu, EPSILON / ciq),
          delta + ((iGamma * sigSqToCiq) / ciq) * w(sign * adjustedDeltaMu, EPSILON / ciq),
        ]
      },
      [0, 0]
    )

    return iTeam.map(({ mu, sigma }) => {
      const sigmaSq = sigma * sigma
      return {
        mu: mu + (sigmaSq / iSigmaSq) * iOmega,
        sigma: sigma * Math.sqrt(Math.max(1 - (sigmaSq / iSigmaSq) * iDelta, EPSILON)),
      }
    })
  })
}

export default model
