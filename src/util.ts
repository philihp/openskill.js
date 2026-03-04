import { zip } from 'ramda'
import constants from './constants'
import { Rating, Options, Gamma, Team, Rank } from './types'

export type TeamMu = number

export type TeamSigmaSq = number

export type TeamRating = [TeamMu, TeamSigmaSq, Team, Rank]

export const sum = (a: number, b: number) => a + b

export const score = (q: number, i: number) => {
  if (q < i) {
    return 0.0
  }
  if (q > i) {
    return 1.0
  }
  // q === i
  return 0.5
}

export const rankings = (teams: Team[], rank: number[] = []) => {
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
const teamRating =
  (options: Options) =>
  (game: Team[]): TeamRating[] => {
    const { Z, ALPHA, TARGET, BALANCE, KAPPA } = constants(options)
    const rank = rankings(game, options.rank)
    return game.map((team, i) => {
      if (!BALANCE) {
        return [
          team.map(({ mu }) => mu).reduce(sum, 0),
          team.map(({ sigma }) => sigma * sigma).reduce(sum, 0),
          team,
          rank[i],
        ]
      }
      // When balance=true, weaker players on a team contribute more to the
      // team rating, emphasizing skill disparity within the team.
      const ordinals = team.map(({ mu, sigma }) => TARGET + ALPHA * (mu - Z * sigma))
      const maxOrdinal = Math.max(...ordinals)
      return [
        team.map(({ mu }, j) => mu * (1 + (maxOrdinal - ordinals[j]) / (maxOrdinal + KAPPA))).reduce(sum, 0),
        team.map(({ sigma }, j) => (sigma * (1 + (maxOrdinal - ordinals[j]) / (maxOrdinal + KAPPA))) ** 2).reduce(sum, 0),
        team,
        rank[i],
      ]
    })
  }

export const ladderPairs = <T>(ranks: T[]): T[][] => {
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

const utilC = (options: Options) => {
  const { BETASQ } = constants(options)
  return (teamRatings: TeamRating[]) =>
    Math.sqrt(teamRatings.map(([_teamMu, teamSigmaSq, _team, _rank]) => teamSigmaSq + BETASQ).reduce(sum, 0))
}

export const utilSumQ = (teamRatings: TeamRating[], c: number) =>
  teamRatings.map(([_qMu, _qSigmaSq, _qTeam, qRank]) =>
    teamRatings
      .filter(([_iMu, _iSigmaSq, _iTeam, iRank]) => iRank >= qRank)
      .map(([iMu, _iSigmaSq, _iTeam, _iRank]) => Math.exp(iMu / c))
      .reduce(sum, 0)
  )

export const utilA = (teamRatings: TeamRating[]) =>
  teamRatings.map(
    ([_iMu, _iSigmaSq, _iTeam, iRank]) =>
      teamRatings.filter(([_qMu, _qSigmaSq, _qTeam, qRank]) => iRank === qRank).length
  )

export const gamma = (options: Options): Gamma =>
  options.gamma ??
  // default to iSigma / c
  ((c: number, _k: number, _mu: number, sigmaSq: number, _team: Rating[], _qRank: number) => Math.sqrt(sigmaSq) / c)

export default (options: Options) => ({
  utilC: utilC(options),
  teamRating: teamRating(options),
  gamma: gamma(options),
})
