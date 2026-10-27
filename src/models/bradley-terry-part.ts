import { zip } from 'ramda'
import util, { score, windowPairs, updatePlayer } from '../util'
import constants from '../constants'
import { Model, Rating } from '../types'

const model: Model = (game: Rating[][], options = {}) => {
  const { TWOBETASQ, KAPPA, WINDOW_SIZE } = constants(options)
  const { weight } = options
  const { teamRating, gamma } = util(options)

  const teamRatings = teamRating(game)
  const windowTeams = windowPairs(teamRatings, WINDOW_SIZE)

  return zip(teamRatings, windowTeams).map(([iTeamRating, iWindow], i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const { omega: omegaSum, delta: deltaSum } = iWindow.reduce(
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

    // average over the comparisons in the window, as openskill.py does, so the
    // update does not grow with the number of neighbors. An empty window has
    // sums of 0, so it divides by 1 to give 0.
    const comparisons = iWindow.length || 1
    const iOmega = omegaSum / comparisons
    const iDelta = deltaSum / comparisons

    return iTeam.map((player, j) => updatePlayer(player, iOmega, iDelta, iSigmaSq, weight?.[i]?.[j] ?? 1, KAPPA))
  })
}

export default model
