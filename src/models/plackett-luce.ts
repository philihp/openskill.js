import util, { utilSumQ, utilA, plMarginAdjustedMu } from '../util'
import constants from '../constants'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { EPSILON } = constants(options)
  const { margin = 0, score: scoreArr } = options
  const { utilC, teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)
  const c = utilC(teamRatings)
  const adjustedMus = scoreArr && margin > 0 ? plMarginAdjustedMu(teamRatings, scoreArr, margin) : undefined
  const sumQ = utilSumQ(teamRatings, c, adjustedMus)
  const a = utilA(teamRatings)

  return teamRatings.map((iTeamRating, i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const effectiveMu = adjustedMus ? adjustedMus[i] : iMu
    const iMuOverCe = Math.exp(effectiveMu / c)
    const [omegaSum, deltaSum] = teamRatings
      .filter(([_qMu, _qSigmaSq, _qTeam, qRank]) => qRank <= iRank)
      .reduce(
        ([omega, delta], _tr, q) => {
          const quotient = iMuOverCe / sumQ[q]
          return [omega + (i === q ? 1 - quotient : -quotient) / a[q], delta + (quotient * (1 - quotient)) / a[q]]
        },
        [0, 0]
      )

    const iGamma = gamma(c, teamRatings.length, ...iTeamRating)
    const iOmega = omegaSum * (iSigmaSq / c)
    const iDelta = iGamma * deltaSum * (iSigmaSq / c ** 2)

    return iTeam.map(({ mu, sigma }) => ({
      mu: mu + (sigma ** 2 / iSigmaSq) * iOmega,
      sigma: sigma * Math.sqrt(Math.max(1 - (sigma ** 2 / iSigmaSq) * iDelta, EPSILON)),
    }))
  })
}

export default model
