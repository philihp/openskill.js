import util, { utilSumQ, utilA } from '../util'
import constants from '../constants'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { KAPPA } = constants(options)
  const { utilC, teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)
  const c = utilC(teamRatings)
  const sumQ = utilSumQ(teamRatings, c)
  const a = utilA(teamRatings)

  return teamRatings.map((iTeamRating, i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const iMuOverCe = Math.exp(iMu / c)
    const { omega: omegaSum, delta: deltaSum } = teamRatings.reduce(
      (acc, [_qMu, _qSigmaSq, _qTeam, qRank], q) => {
        if (qRank > iRank) return acc
        const quotient = iMuOverCe / sumQ[q]
        acc.omega += (i === q ? 1 - quotient : -quotient) / a[q]
        acc.delta += (quotient * (1 - quotient)) / a[q]
        return acc
      },
      { omega: 0, delta: 0 }
    )

    const iGamma = gamma(c, teamRatings.length, ...iTeamRating)
    const iOmega = omegaSum * (iSigmaSq / c)
    const iDelta = deltaSum * (iSigmaSq / c ** 2) * iGamma

    return iTeam.map(({ mu, sigma }) => ({
      mu: mu + (sigma ** 2 / iSigmaSq) * iOmega,
      sigma: sigma * Math.sqrt(Math.max(1 - (sigma ** 2 / iSigmaSq) * iDelta, KAPPA)),
    }))
  })
}

export default model
