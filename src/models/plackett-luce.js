import util, { utilSumQ, utilA } from '../util'
import constants from '../constants'

export default (game, options = {}) => {
  const { EPSILON } = constants(options)
  const { utilC, teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)
  const c = utilC(teamRatings)
  const sumQ = utilSumQ(teamRatings, c)
  const a = utilA(teamRatings)

  return teamRatings.map((iTeamRating, i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const iMuOverCe = Math.exp(iMu / c) // tmp1
    const [omegaSum, deltaSum] = teamRatings
      .filter(([_qMu, _qSigmaSq, _qTeam, qRank]) => qRank <= iRank)
      .reduce(
        ([omega, delta], [_], q) => {
          const quotient = iMuOverCe / sumQ[q]
          return [
            omega + (i === q ? 1 - quotient : -quotient) / a[q],
            delta + (quotient * (1 - quotient)) / a[q],
          ]
        },
        [0, 0]
      )

    const iGamma = gamma(c, teamRatings.length, ...iTeamRating)
    const iOmega = omegaSum * (iSigmaSq / c)
    const iDelta = iGamma * deltaSum * (iSigmaSq / c ** 2)

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
