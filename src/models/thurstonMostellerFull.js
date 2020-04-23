import { teamRating } from '../util'
import { w, v, vt, wt } from '../statistics'
import { BETASQ, EPSILON } from '../constants'

const TWOBETASQ = 2 * BETASQ

export default (game, _options) => {
  const teamRatings = teamRating(game)

  return teamRatings.map(([iMu, iSigmaSq, iTeam, iRank]) => {
    const [iOmega, iDelta] = teamRatings
      .filter(([_qMu, _qSigmaSq, _qTeam, qRank]) => qRank !== iRank)
      .reduce(
        ([omega, delta], [qMu, qSigmaSq, _qTeam, qRank]) => {
          const ciq = Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
          const tmp = (iMu - qMu) / ciq
          const sigSqToCiq = iSigmaSq / ciq
          const gamma = Math.sqrt(iSigmaSq) / ciq

          /* istanbul ignore next */
          if (qRank === iRank) {
            return [
              omega + sigSqToCiq * vt(tmp, EPSILON / ciq),
              delta + ((gamma * sigSqToCiq) / ciq) * wt(tmp, EPSILON / ciq),
            ]
          }

          const sign = qRank > iRank ? 1 : -1
          return [
            omega + sign * sigSqToCiq * v(sign * tmp, EPSILON / ciq),
            delta + ((gamma * sigSqToCiq) / ciq) * w(sign * tmp, EPSILON / ciq),
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
