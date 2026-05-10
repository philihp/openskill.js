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
    let omegaSum = 0
    let deltaSum = 0
    for (let q = 0; q < teamRatings.length; q += 1) {
      const quotient = iMuOverCe / sumQ[q]
      if (teamRatings[q][3] <= iRank) {
        deltaSum += (quotient * (1 - quotient)) / a[q]
        if (q === i) {
          omegaSum += (1 - quotient) / a[q]
        } else {
          omegaSum -= quotient / a[q]
        }
      }
    }

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
