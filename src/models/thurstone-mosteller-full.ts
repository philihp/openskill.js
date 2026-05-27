import util from '../util'
import constants from '../constants'
import { w, v, vt, wt } from '../statistics'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, EPSILON, KAPPA } = constants(options)
  const { teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)

  return teamRatings.map((iTeamRating, i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const { omega: iOmega, delta: iDelta } = teamRatings
      .filter((_, q) => i !== q)
      .reduce(
        (acc, [qMu, qSigmaSq, _qTeam, qRank]) => {
          const ciq = Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
          const deltaMu = (iMu - qMu) / ciq
          const qEta = iSigmaSq / ciq
          const iGamma = gamma(ciq, teamRatings.length, ...iTeamRating)

          if (qRank === iRank) {
            acc.omega += qEta * vt(deltaMu, EPSILON / ciq)
            acc.delta += ((iGamma * qEta) / ciq) * wt(deltaMu, EPSILON / ciq)
            return acc
          }

          const sign = qRank > iRank ? 1 : -1
          acc.omega += sign * qEta * v(sign * deltaMu, EPSILON / ciq)
          acc.delta += ((iGamma * qEta) / ciq) * w(sign * deltaMu, EPSILON / ciq)
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
