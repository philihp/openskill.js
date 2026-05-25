import util, { marginDivisor } from '../util'
import constants from '../constants'
import { w, v, vt, wt } from '../statistics'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, EPSILON, KAPPA } = constants(options)
  const { margin = 0, score } = options
  const { teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)

  const divisor = (i: number, q: number): number => marginDivisor(score!, margin, i, q)

  return teamRatings.map((iTeamRating, i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const [iOmega, iDelta] = teamRatings
      .map((teamRating, q) => [teamRating, q] as const)
      .filter(([, q]) => i !== q)
      .reduce(
        ([omega, delta], [[qMu, qSigmaSq, _qTeam, qRank], q]) => {
          const ciq = Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
          const deltaMu = (iMu - qMu) / ciq
          const sigSqToCiq = iSigmaSq / ciq
          const iGamma = gamma(ciq, teamRatings.length, ...iTeamRating)
          const adjustedDeltaMu = deltaMu / divisor(i, q)

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
