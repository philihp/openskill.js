import { zip, cond, lt, gt, T } from 'ramda'
import { teamRating, ladderPairs } from '../util'
import { w, v, vt, wt } from '../statistics'
import { BETASQ, EPSILON } from '../constants'

const TWOBETASQ = 2 * BETASQ

export default (game, _options) => {
  const teamRatings = teamRating(game)
  const adjacentTeams = ladderPairs(teamRatings)

  return zip(teamRatings, adjacentTeams).map(([iTeamRating, iAdjacent]) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const [iOmega, iDelta] = iAdjacent
      .filter(([_qMu, _qSigmaSq, _qTeam, qRank]) => qRank !== iRank)
      .reduce(
        ([omega, delta], [qMu, qSigmaSq, _qTeam, qRank]) => {
          const ciq = Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
          const tmp = (iMu - qMu) / ciq
          const sigSqToCiq = iSigmaSq / ciq
          const gamma = Math.sqrt(iSigmaSq) / ciq

          return cond([
            [
              lt(iRank),
              () => [
                omega + sigSqToCiq * v(tmp, EPSILON / ciq),
                delta + ((gamma * sigSqToCiq) / ciq) * w(tmp, EPSILON / ciq),
              ],
            ],
            [
              gt(iRank),
              () => [
                omega + -sigSqToCiq * v(-tmp, EPSILON / ciq),
                delta + ((gamma * sigSqToCiq) / ciq) * w(-tmp, EPSILON / ciq),
              ],
            ],
            [
              T,
              /* istanbul ignore next */
              () => [
                omega + sigSqToCiq * vt(tmp, EPSILON / ciq),
                delta + ((gamma * sigSqToCiq) / ciq) * wt(tmp, EPSILON / ciq),
              ],
            ],
          ])(qRank)
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
