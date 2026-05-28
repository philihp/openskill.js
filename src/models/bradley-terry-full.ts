import util, { score, marginDivisor } from '../util'
import constants from '../constants'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, EPSILON } = constants(options)
  const { margin = 0, score: scoreArr } = options
  const { teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)

  const divisor = (i: number, q: number): number => marginDivisor(scoreArr!, margin, i, q)

  return teamRatings.map((iTeamRating, i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const [iOmega, iDelta] = teamRatings
      .filter((_, q) => q !== i)
      .reduce(
        ([omega, delta], [qMu, qSigmaSq, _qTeam, qRank], q) => {
          const ciq = Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
          const piq = 1 / (1 + Math.exp((qMu - iMu) / divisor(i, q) / ciq))
          const sigSqToCiq = iSigmaSq / ciq
          const iGamma = gamma(ciq, teamRatings.length, ...iTeamRating)

          return [
            omega + sigSqToCiq * (score(qRank, iRank) - piq),
            delta + ((iGamma * sigSqToCiq) / ciq) * piq * (1 - piq),
          ]
        },
        [0, 0]
      )

    return iTeam.map(({ mu, sigma }) => {
      const sigmaSq = sigma * sigma
      return {
        mu: mu + (sigmaSq / iSigmaSq) * iOmega,
        sigma: sigma * Math.sqrt(Math.max(1 - (sigmaSq / iSigmaSq) * iDelta, EPSILON)),
      }
    })
  })
}

export default model
