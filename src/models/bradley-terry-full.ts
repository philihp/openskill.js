import util, { score } from '../util'
import constants from '../constants'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, KAPPA } = constants(options)
  const { weight } = options
  const { teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)

  return teamRatings.map((iTeamRating, i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const { omega: iOmega, delta: iDelta } = teamRatings
      .filter((_, q) => q !== i)
      .reduce(
        (acc, [qMu, qSigmaSq, _qTeam, qRank]) => {
          const ciq = Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
          const piq = 1 / (1 + Math.exp((qMu - iMu) / ciq))
          const qEta = iSigmaSq / ciq
          const iGamma = gamma(ciq, teamRatings.length, ...iTeamRating)

          acc.omega += qEta * (score(qRank, iRank) - piq)
          acc.delta += ((iGamma * qEta) / ciq) * piq * (1 - piq)
          return acc
        },
        { omega: 0, delta: 0 }
      )

    return iTeam.map((player, j) => {
      const w = weight?.[i]?.[j] ?? 1
      const sigmaSq = player.sigma * player.sigma
      const factor = iOmega >= 0 ? w : 1 / w
      return {
        mu: player.mu + (sigmaSq / iSigmaSq) * iOmega * factor,
        sigma: player.sigma * Math.sqrt(Math.max(1 - (sigmaSq / iSigmaSq) * iDelta * factor, KAPPA)),
      }
    })
  })
}

export default model
