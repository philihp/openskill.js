import util, { utilSumQ, utilA, plMarginAdjustedMu } from '../util'
import constants from '../constants'
import { Rating, Options, Model } from '../types'

const model: Model = (game: Rating[][], options: Options = {}) => {
  const { TWOBETASQ, EPSILON, KAPPA } = constants(options)
  const { margin = 0, score: scoreArr } = options
  const { utilC, teamRating, gamma } = util(options)
  const teamRatings = teamRating(game)
  const c = utilC(teamRatings)
  const adjustedMus = score && margin > 0 ? plMarginAdjustedMu(teamRatings, score, margin) : undefined
  const sumQ = utilSumQ(teamRatings, c, adjustedMus)
  const a = utilA(teamRatings)

  return teamRatings.map((iTeamRating, i) => {
    const [iMu, iSigmaSq, iTeam, iRank] = iTeamRating
    const [iOmega, iDelta] = teamRatings
      .map((tr, idx) => ({ tr, idx }))
      .filter(({ idx }) => idx !== i)
      .reduce(
        ([omega, delta], { tr: [qMu, qSigmaSq, _qTeam, qRank], idx: q }) => {

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
