import { zip } from 'ramda'
import util, { ladderPairs, windowPairs, updatePlayer } from '../util'
import { w, v, vt, wt } from '../statistics'
import constants from '../constants'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, EPSILON, KAPPA, WINDOW_SIZE } = constants(options)
  const { weight } = options
  const { teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)
  // without windowSize, compare adjacent teams only, as in 5.x. With it, use
  // openskill.py's sliding window.
  const windowTeams = WINDOW_SIZE === undefined ? ladderPairs(teamRatings) : windowPairs(teamRatings, WINDOW_SIZE)

  return zip(teamRatings, windowTeams).map(([iTeamRating, iWindow], i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const { omega: omegaSum, delta: deltaSum } = iWindow.reduce(
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

    // with windowSize, average over the comparisons in the window, as
    // openskill.py does. An empty window has sums of 0, so it divides by 1 to
    // give 0. Without windowSize, keep the 5.x sum.
    const comparisons = WINDOW_SIZE === undefined ? 1 : iWindow.length || 1
    const iOmega = omegaSum / comparisons
    const iDelta = deltaSum / comparisons

    return iTeam.map((player, j) => updatePlayer(player, iOmega, iDelta, iSigmaSq, weight?.[i]?.[j] ?? 1, KAPPA))
  })
}

export default model
