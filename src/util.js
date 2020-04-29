import { zip, sum } from 'ramda'
import { BETASQ } from './constants'

const intoRankHash = (accum, value, index) => {
  return {
    ...accum,
    [index + 1]: value,
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

export const teamRating = (game) =>
  game.map((team, i) => [
    sum(team.map(({ mu }) => mu)),
    sum(team.map(({ sigma }) => sigma * sigma)),
    team,
    i + 1,
  ])

export const ladderPairs = (ranks) => {
  const size = ranks.length
  const left = [null, ...ranks.slice(0, size - 1)]
  const right = [...ranks.slice(1), null]
  return zip(left, right).map(([l, r]) => {
    if (l !== null && r !== null) return [l, r]
    if (l !== null && r === null) return [l]
    if (l === null && r !== null) return [r]
    return [] // this should really only happen when size === 1
  })
}

export const utilC = (teamRatings) =>
  Math.sqrt(
    sum(
      teamRatings.map(
        ([_teamMu, teamSigmaSq, _team, _rank]) => teamSigmaSq + BETASQ
      )
    )
  )

export const utilSumQ = (teamRatings, c) =>
  teamRatings
    .map(([_qMu, _qSigmaSq, _qTeam, qRank]) =>
      sum(
        teamRatings
          .filter(([_iMu, _iSigmaSq, _iTeam, iRank]) => iRank >= qRank)
          .map(([iMu, _iSigmaSq, _iTeam, _iRank]) => Math.exp(iMu / c))
      )
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
