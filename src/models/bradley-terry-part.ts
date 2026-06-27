import { zip } from 'ramda'
import util, { score, ladderPairs, updatePlayer } from '../util'
import constants from '../constants'
import { Model, Rating } from '../types'

const model: Model = (game: Rating[][], options = {}) => {
  const { TWOBETASQ, KAPPA } = constants(options)
  const { weight } = options
  const { teamRating, gamma } = util(options)

  const teamRatings = teamRating(game)
  const adjacentTeams = ladderPairs(teamRatings)

  return zip(teamRatings, adjacentTeams).map(([iTeamRating, iAdjacents], i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const { omega: iOmega, delta: iDelta } = iAdjacents.reduce(
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

    return iTeam.map((player, j) => updatePlayer(player, iOmega, iDelta, iSigmaSq, weight?.[i]?.[j] ?? 1, KAPPA))
  })
}

export default model
