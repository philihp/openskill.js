import { transpose } from 'ramda'
import { teamRating, utilSumQ, utilC, utilA, sum } from '../util'
import { EPSILON } from '../constants'

export default (game, { _log }) => {
  const teamRatings = teamRating(game)
  const c = utilC(teamRatings)
  const sumQ = utilSumQ(teamRatings, c)
  const a = utilA(teamRatings)

  return teamRatings.map(([iMu, iSigmaSq, iTeam, iRank]) => {
    const iMuOverCe = Math.exp(iMu / c)
    const [omegaSet, deltaSet] = transpose(
      teamRatings
        .filter(([_qMu, _qSigmaSq, _qTeam, qRank]) => qRank <= iRank)
        .map(([_qMu, _qSigmaSq, _qTeam, qRank]) => {
          const quotient = iMuOverCe / sumQ[qRank]
          const mu =
            qRank === iRank ? 1 - quotient / a[qRank] : -quotient / a[qRank]
          const sigma = (quotient * (1 - quotient)) / a[qRank]
          return [mu, sigma]
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
