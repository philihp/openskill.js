import { zip } from 'ramda'
import constants from './constants'

export const sum = (a, b) => a + b

export const score = (q, i) => {
  if (q < i) {
    return 0.0
  }
  if (q > i) {
    return 1.0
  }
  // q === i
  return 0.5
}

export const rankings = (teams, rank = []) => {
  const teamScores = teams.map((_, i) => rank[i] || i)
  const outRank = new Array(teams.length)

  let s = 0
  for (let j = 0; j < teamScores.length; j += 1) {
    if (j > 0 && teamScores[j - 1] < teamScores[j]) {
      s = j
    }
    outRank[j] = s
  }
  return outRank
}

// this is basically shared code, precomputed for every model
const teamRating = (options) => (game) => {
  const rank = rankings(game, options.rank)
  return game.map((team, i) => [
    // mu[i]
    team.map(({ mu }) => mu).reduce(sum, 0),
    // sigma^2[i]
    team.map(({ sigma }) => sigma * sigma).reduce(sum, 0),
    // (original team data)
    team,
    // rank[i]
    rank[i],
  ])
}

export const ladderPairs = (ranks) => {
  const size = ranks.length
  const left = [undefined, ...ranks.slice(0, size - 1)]
  const right = [...ranks.slice(1), undefined]
  return zip(left, right).map(([l, r]) => {
    if (l !== undefined && r !== undefined) return [l, r]
    if (l !== undefined && r === undefined) return [l]
    if (l === undefined && r !== undefined) return [r]
    return [] // this should really only happen when size === 1
  })
}

const utilC = (options) => {
  const { BETASQ } = constants(options)
  return (teamRatings) =>
    Math.sqrt(
      teamRatings
        .map(([_teamMu, teamSigmaSq, _team, _rank]) => teamSigmaSq + BETASQ)
        .reduce(sum, 0)
    )
}

export const utilSumQ = (teamRatings, c) =>
  teamRatings.map(([_qMu, _qSigmaSq, _qTeam, qRank]) =>
    teamRatings
      .filter(([_iMu, _iSigmaSq, _iTeam, iRank]) => iRank >= qRank)
      .map(([iMu, _iSigmaSq, _iTeam, _iRank]) => Math.exp(iMu / c))
      .reduce(sum, 0)
  )

export const utilA = (teamRatings) =>
  teamRatings.map(
    ([_iMu, _iSigmaSq, _iTeam, iRank]) =>
      teamRatings.filter(([_qMu, _qSigmaSq, _qTeam, qRank]) => iRank === qRank)
        .length
  )

export const gamma = (options) =>
  options.gamma ??
  // default to iSigma / c
  ((c, _k, _mu, sigmaSq, _team, _qRank) => Math.sqrt(sigmaSq) / c)

export default (options) => ({
  utilC: utilC(options),
  teamRating: teamRating(options),
  gamma: gamma(options),
})
