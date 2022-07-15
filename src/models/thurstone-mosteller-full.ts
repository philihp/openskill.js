import util from '../util'
import constants from '../constants'
import { w, v, vt, wt } from '../statistics'
import { Rating, Options } from '../types'

export default (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, EPSILON } = constants(options)
  const { teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)

  return teamRatings.map((iTeamRating, i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const [iOmega, iDelta] = teamRatings
      .filter((_, q) => i !== q)
      .reduce(
        ([omega, delta], [qMu, qSigmaSq, _qTeam, qRank]) => {
          const ciq = Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
          const deltaMu = (iMu - qMu) / ciq
          const sigSqToCiq = iSigmaSq / ciq
          const iGamma = gamma(ciq, teamRatings.length, ...iTeamRating)

          if (qRank === iRank) {
            return [
              omega + sigSqToCiq * vt(deltaMu, EPSILON / ciq),
              delta +
                ((iGamma * sigSqToCiq) / ciq) * wt(deltaMu, EPSILON / ciq),
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
