import { zip } from 'ramda'
import util, { ladderPairs } from '../util'
import { w, v, vt, wt } from '../statistics'
import constants from '../constants'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, EPSILON, KAPPA } = constants(options)
  const { teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)
  const adjacentTeams = ladderPairs(teamRatings)

  return zip(teamRatings, adjacentTeams).map(([iTeamRating, iAdjacents]) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const { omega: iOmega, delta: iDelta } = iAdjacents.reduce(
      (acc, [qMu, qSigmaSq, _qTeam, qRank]) => {
        const ciq = 2 * Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
        const deltaMu = (iMu - qMu) / ciq
        const sigSqToCiq = iSigmaSq / ciq
        const iGamma = gamma(ciq, teamRatings.length, ...iTeamRating)

        if (qRank === iRank) {
          acc.omega += sigSqToCiq * vt(deltaMu, EPSILON / ciq)
          acc.delta += ((iGamma * sigSqToCiq) / ciq) * wt(deltaMu, EPSILON / ciq)
          return acc
        }

        const sign = qRank > iRank ? 1 : -1
        acc.omega += sign * sigSqToCiq * v(sign * deltaMu, EPSILON / ciq)
        acc.delta += ((iGamma * sigSqToCiq) / ciq) * w(sign * deltaMu, EPSILON / ciq)
        return acc
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
