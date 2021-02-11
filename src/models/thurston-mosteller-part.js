import { zip } from 'ramda'
import util, { ladderPairs } from '../util'
import statistics, { w, v } from '../statistics'
import constants from '../constants'

export default (game, options = {}) => {
  const { TWOBETASQ, EPSILON } = constants(options)
  const { teamRating, gamma } = util(options)
  const { vt, wt } = statistics(options)
  const teamRatings = teamRating(game)
  const adjacentTeams = ladderPairs(teamRatings)

  return zip(teamRatings, adjacentTeams).map(([iTeamRating, iAdjacents]) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const [iOmega, iDelta] = iAdjacents.reduce(
      ([omega, delta], [qMu, qSigmaSq, _qTeam, qRank]) => {
        const ciq = 2 * Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
        const deltaMu = (iMu - qMu) / ciq
        const sigSqToCiq = iSigmaSq / ciq
        const iGamma = gamma(ciq, teamRatings.length, ...iTeamRating)

        if (qRank === iRank) {
          return [
            omega + sigSqToCiq * vt(deltaMu, EPSILON / ciq),
            delta + ((iGamma * sigSqToCiq) / ciq) * wt(deltaMu, EPSILON / ciq),
          ]
        }

        const sign = qRank > iRank ? 1 : -1
        return [
          omega + sign * sigSqToCiq * v(sign * deltaMu, EPSILON / ciq),
          delta +
            ((iGamma * sigSqToCiq) / ciq) * w(sign * deltaMu, EPSILON / ciq),
        ]
      },
      [0, 0]
    )

    return iTeam.map(({ mu, sigma }) => {
      const sigmaSq = sigma * sigma
      return {
        mu: mu + (sigmaSq / iSigmaSq) * iOmega,
        sigma:
          sigma *
          Math.sqrt(Math.max(1 - (sigmaSq / iSigmaSq) * iDelta, EPSILON)),
      }
    })
  })
}
