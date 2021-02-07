import { zip, sort, pipe, transpose, reverse } from 'ramda'
import { BETASQ } from './constants'

export const sum = (a, b) => a + b

const intoRankHash = (accum, value, index) => {
  return {
    ...accum,
    [index]: value,
  }
}

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
    outRank[j] = s + 1
  }
  return outRank
}

// this is basically shared code, precomputed for every model
export const teamRating = (game, options = {}) => {
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

export const utilC = (teamRatings) =>
  Math.sqrt(
    teamRatings
      .map(([_teamMu, teamSigmaSq, _team, _rank]) => teamSigmaSq + BETASQ)
      .reduce(sum, 0)
  )

export const utilSumQ = (teamRatings, c) =>
  teamRatings
    .map(([_qMu, _qSigmaSq, _qTeam, qRank]) =>
      teamRatings
        .filter(([_iMu, _iSigmaSq, _iTeam, iRank]) => iRank >= qRank)
        .map(([iMu, _iSigmaSq, _iTeam, _iRank]) => Math.exp(iMu / c))
        .reduce(sum, 0)
    )
    .reduce(intoRankHash, {})

export const utilA = (teamRatings) =>
  teamRatings
    .map(
      ([_iMu, _iSigmaSq, _iTeam, iRank]) =>
        teamRatings.filter(
          ([_qMu, _qSigmaSq, _qTeam, qRank]) => iRank === qRank
        ).length
    )
    .reduce(intoRankHash, {})

export const reorder = (rank) => (teams) => {
  if (rank === undefined) return [teams]
  return pipe(
    zip,
    sort(([a], [b]) => a - b),
    transpose,
    reverse
  )(rank, teams) // -> [orderedTeams, orderedRanks]
}
