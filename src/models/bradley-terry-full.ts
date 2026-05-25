import util, { score, marginDivisor } from '../util'
import constants from '../constants'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, EPSILON, KAPPA } = constants(options)
  const { margin = 0, score: scoreArr } = options
  const { teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)

  const divisor = (i: number, q: number): number => marginDivisor(scoreArr!, margin, i, q)

  return teamRatings.map((iTeamRating, i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const [iOmega, iDelta] = teamRatings
      .map((tr, idx) => ({ tr, idx }))
      .filter(({ idx }) => idx !== i)
      .reduce(
        ([omega, delta], { tr: [qMu, qSigmaSq, _qTeam, qRank], idx: q }) => {
          const ciq = Math.sqrt(iSigmaSq + qSigmaSq + TWOBETASQ)
          const piq = 1 / (1 + Math.exp((qMu - iMu) / divisor(i, q) / ciq))
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
