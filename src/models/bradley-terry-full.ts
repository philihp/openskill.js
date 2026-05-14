import util, { score } from '../util'
import constants from '../constants'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, KAPPA } = constants(options)
  const { teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)

  return teamRatings.map((iTeamRating, i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const { omega: iOmega, delta: iDelta } = teamRatings
      .filter((_, q) => q !== i)
      .reduce(
        (acc, [qMu, qSigmaSq, _qTeam, qRank]) => {
          const ciq = Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
          const piq = 1 / (1 + Math.exp((qMu - iMu) / ciq))
          const sigSqToCiq = iSigmaSq / ciq
          const iGamma = gamma(ciq, teamRatings.length, ...iTeamRating)

          acc.omega += sigSqToCiq * (score(qRank, iRank) - piq)
          acc.delta += ((iGamma * sigSqToCiq) / ciq) * piq * (1 - piq)
          return acc
        },
        { omega: 0, delta: 0 }
      )

    return iTeam.map(({ mu, sigma }) => {
      const sigmaSq = sigma * sigma
      return {
        mu: mu + (sigmaSq / iSigmaSq) * iOmega,
        sigma: sigma * Math.sqrt(Math.max(1 - (sigmaSq / iSigmaSq) * iDelta, KAPPA)),
      }
    })
  })
}

export default model
