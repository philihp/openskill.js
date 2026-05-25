import { zip } from 'ramda'
import util, { ladderPairs, marginDivisor } from '../util'
import { w, v, vt, wt } from '../statistics'
import constants from '../constants'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, EPSILON, KAPPA } = constants(options)
  const { margin = 0, score: scoreArr } = options
  const { teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)
  const adjacentTeams = ladderPairs(teamRatings)

  const divisor = (i: number, q: number): number => marginDivisor(scoreArr!, margin, i, q)

  return zip(teamRatings, adjacentTeams).map(([iTeamRating, iAdjacents], i) => {
    // find original team index for score-indexed divisor
    const qIndices = iAdjacents.map((tr) => teamRatings.indexOf(tr))
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const [iOmega, iDelta] = teamRatings
      .map((tr, idx) => ({ tr, idx }))
      .filter(({ idx }) => idx !== i)
      .reduce(
        ([omega, delta], { tr: [qMu, qSigmaSq, _qTeam, qRank], idx: q }) => {
        const ciq = 2 * Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
        const deltaMu = (iMu - qMu) / ciq
        const sigSqToCiq = iSigmaSq / ciq
        const iGamma = gamma(ciq, teamRatings.length, ...iTeamRating)
        const adjustedDeltaMu = deltaMu / divisor(i, qIndices[qi])

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
      { omega: 0, delta: 0 }
    )

    return iTeam.map(({ mu, sigma }) => {
      const sigmaSq = sigma * sigma
      return {
        mu: mu + (sigmaSq / iSigmaSq) * iOmega,
        sigma: sigma * Math.sqrt(Math.max(1 - (sigmaSq / iSigmaSq) * iDelta, KAPPA)),
      }
    })
  })
}

export default model
