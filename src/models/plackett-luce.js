import { transpose } from 'ramda'
import { teamRating, utilSumQ, utilC, utilA, sum } from '../util'
import { EPSILON } from '../constants'

export default (game, options = {}) => {
  const teamRatings = teamRating(game, options)
  const c = utilC(teamRatings)
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
    const gamma = Math.sqrt(iSigmaSq) / c
    const iOmega = (omegaSet.reduce(sum, 0) * iSigmaSq) / c
    const iDelta = (gamma * deltaSet.reduce(sum, 0) * iSigmaSq) / c / c

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
