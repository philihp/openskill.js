import util, { score, updatePlayer } from '../util'
import constants from '../constants'
import { marginDivisors } from '../margin'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, KAPPA } = constants(options)
  const { weight } = options
  const { teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)
  const divisor = marginDivisors(options, teamRatings.length)

  return teamRatings.map((iTeamRating, i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const { omega: iOmega, delta: iDelta } = teamRatings.reduce(
      (acc, [qMu, qSigmaSq, _qTeam, qRank], q) => {
        if (q === i) return acc
        const ciq = Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
        const piq = 1 / (1 + Math.exp((qMu - iMu) / divisor(i, q) / ciq))
        const qEta = iSigmaSq / ciq
        const iGamma = gamma(ciq, teamRatings.length, ...iTeamRating)

        acc.omega += qEta * (score(qRank, iRank) - piq)
        acc.delta += ((iGamma * qEta) / ciq) * piq * (1 - piq)
        return acc
      },
      { omega: 0, delta: 0 }
    )

    return iTeam.map((player, j) => updatePlayer(player, iOmega, iDelta, iSigmaSq, weight?.[i]?.[j] ?? 1, KAPPA))
  })
}

export default model
