import { teamRating } from '../util'
import statistics, { w, v } from '../statistics'
import constants from '../constants'

export default (game, options = {}) => {
  const { TWOBETASQ, EPSILON } = constants(options)
  const { vt, wt } = statistics(options)
  const teamRatings = teamRating(game, options)

  return teamRatings.map(([iMu, iSigmaSq, iTeam, iRank]) => {
    const [iOmega, iDelta] = teamRatings
      .filter(([_qMu, _qSigmaSq, _qTeam, qRank]) => qRank !== iRank)
      .reduce(
        ([omega, delta], [qMu, qSigmaSq, _qTeam, qRank]) => {
          const ciq = Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
          const deltaMu = (iMu - qMu) / ciq
          const sigSqToCiq = iSigmaSq / ciq
          const gamma = Math.sqrt(iSigmaSq) / ciq

          /* istanbul ignore next */
          if (qRank === iRank) {
            return [
              omega + sigSqToCiq * vt(deltaMu, EPSILON / ciq),
              delta + ((gamma * sigSqToCiq) / ciq) * wt(deltaMu, EPSILON / ciq),
            ]
          }

          const sign = qRank > iRank ? 1 : -1
          return [
            omega + sign * sigSqToCiq * v(sign * deltaMu, EPSILON / ciq),
            delta +
              ((gamma * sigSqToCiq) / ciq) * w(sign * deltaMu, EPSILON / ciq),
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
