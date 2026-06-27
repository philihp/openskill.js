import { zip } from 'ramda'
import util, { ladderPairs } from '../util'
import { w, v, vt, wt } from '../statistics'
import constants from '../constants'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, EPSILON, KAPPA } = constants(options)
  const { weight } = options
  const { teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)
  const adjacentTeams = ladderPairs(teamRatings)

  return zip(teamRatings, adjacentTeams).map(([iTeamRating, iAdjacents], i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const { omega: iOmega, delta: iDelta } = iAdjacents.reduce(
      (acc, [qMu, qSigmaSq, _qTeam, qRank]) => {
        const ciq = 2 * Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
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
