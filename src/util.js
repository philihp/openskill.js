import { BETASQ } from './constants'

export const sum = (a, b) => a + b

const intoRankHash = (accum, value, index) => {
  return {
    ...accum,
    [index + 1]: value,
  }
}

export const teamRating = (game) =>
  game.map((team, i) => [
    team.map(({ mu }) => mu).reduce(sum, 0),
    team.map(({ sigma }) => sigma * sigma).reduce(sum, 0),
    team,
    i + 1,
  ])

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
