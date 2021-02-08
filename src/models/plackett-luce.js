import { transpose } from 'ramda'
import { teamRating, utilSumQ, UTIL_C, utilA, sum } from '../util'
import constants from '../constants'

export default (game, options = {}) => {
  const { EPSILON } = constants(options)
  const teamRatings = teamRating(game, options)
  const c = UTIL_C(options)(teamRatings)
  const sumQ = utilSumQ(teamRatings, c)
  const a = utilA(teamRatings)

  return teamRatings.map(([iMu, iSigmaSq, iTeam, iRank], i) => {
    const iMuOverCe = Math.exp(iMu / c)
    const [omegaSet, deltaSet] = transpose(
      teamRatings
        .filter(([_qMu, _qSigmaSq, _qTeam, qRank]) => qRank <= iRank)
        .map(([_], q) => {
          const quotient = iMuOverCe / sumQ[q]
          return [
            (i === q ? 1 - quotient : -quotient) / a[q],
            (quotient * (1 - quotient)) / a[q],
          ]
        })
    )
    const iOmega = (omegaSet.reduce(sum, 0) * iSigmaSq) / c
    const iDelta =
      (Math.sqrt(iSigmaSq) * deltaSet.reduce(sum, 0) * iSigmaSq) / c ** 3

    return iTeam.map(({ mu, sigma }) => {
      return {
        mu: mu + (sigma ** 2 / iSigmaSq) * iOmega,
        sigma:
          sigma *
          Math.sqrt(Math.max(1 - (sigma ** 2 / iSigmaSq) * iDelta, EPSILON)),
      }
    })
  })
}
