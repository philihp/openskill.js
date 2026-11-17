import { range, zip } from 'ramda'
import util, { score, ladderPairs, windowPairs, updatePlayer } from '../util'
import constants from '../constants'
import { marginDivisors } from '../margin'
import { Model, Rating } from '../types'

const model: Model = (game, options = {}) => {
  const { TWOBETASQ, KAPPA, WINDOW_SIZE } = constants(options)
  const { weight } = options
  const { teamRating, gamma } = util(options)

  const teamRatings = teamRating(game)
  // without windowSize, compare adjacent teams only, as in 5.x. With it, use
  // openskill.py's sliding window.
  // the windows hold team indexes, so that the margin can find the scores
  const indexes = range(0, teamRatings.length)
  const windows = WINDOW_SIZE === undefined ? ladderPairs(indexes) : windowPairs(indexes, WINDOW_SIZE)
  const divisor = marginDivisors(options, teamRatings.length)

  return zip(teamRatings, windows).map(([iTeamRating, iWindow], i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const { omega: omegaSum, delta: deltaSum } = iWindow.reduce(
      (acc, q) => {
        const [qMu, qSigmaSq, _qTeam, qRank] = teamRatings[q]
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
