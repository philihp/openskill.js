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

/**
 * Linearly rescale a vector into `[targetMin, targetMax]`, mapping the vector's
 * own minimum to `targetMin` and maximum to `targetMax`. Mirrors openskill.py's
 * `_normalize`, used to bound partial-play weights so only the *relative*
 * differences within a team matter. A single-element vector maps to
 * `[targetMax]`; a vector whose values are all equal collapses to all
 * `targetMin` (since there is no relative difference to preserve).
 */
export const normalize = (vector: number[], targetMin: number, targetMax: number): number[] => {
  if (vector.length === 1) return [targetMax]
  const sourceMin = Math.min(...vector)
  const sourceMax = Math.max(...vector)
  const sourceRange = sourceMax - sourceMin || 0.0001
  const targetRange = targetMax - targetMin
  return vector.map((value) => ((value - sourceMin) / sourceRange) * targetRange + targetMin)
}

/**
 * Apply a model's team-level `omega`/`delta` to a single player to produce their
 * updated rating, scaled by a partial-play `weight`. The weight amplifies the
 * update when the team's omega is non-negative (a win-ward push) and damps it
 * when omega is negative, matching openskill.py's asymmetric handling. A weight
 * of `1` is a no-op, so this reduces exactly to the unweighted update when no
 * weights are supplied.
 */
export const updatePlayer = (
  { mu, sigma }: Rating,
  iOmega: number,
  iDelta: number,
  iSigmaSq: number,
  weight: number,
  kappa: number
): Rating => {
  const sigmaSq = sigma * sigma
  const w = iOmega >= 0 ? weight : 1 / weight
  return {
    mu: mu + (sigmaSq / iSigmaSq) * iOmega * w,
    sigma: sigma * Math.sqrt(Math.max(1 - (sigmaSq / iSigmaSq) * iDelta * w, kappa)),
  }
}

export const rankings = (teams: Team[], rank: number[] = []) => {
  const teamScores = teams.map((_, i) => rank[i] ?? i)
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

type TeamSums = { mu: number; sigSq: number }

// this is basically shared code, precomputed for every model
const teamRating =
  (options: Options) =>
  (game: Team[]): TeamRating[] => {
    const { Z, ALPHA, TARGET, BALANCE, KAPPA } = constants(options)
    const rank = rankings(game, options.rank)
    return game.map((team, i) => {
      if (!BALANCE) {
        // Single fused traversal: accumulate Σμ and Σσ² in one pass instead
        // of `team.map(mu).reduce + team.map(σ²).reduce`.
        const { mu: muSum, sigSq } = team.reduce<TeamSums>(
          (a, { mu, sigma }) => {
            a.mu += mu
            a.sigSq += sigma * sigma
            return a
          },
          { mu: 0, sigSq: 0 }
        )
        return [muSum, sigSq, team, rank[i]]
      }
      // When balance=true, weaker players on a team contribute more to the
      // team rating, emphasizing skill disparity within the team.
      const ordinals = team.map(({ mu, sigma }) => TARGET + ALPHA * (mu - Z * sigma))
      const maxOrdinal = Math.max(...ordinals)
      const denom = maxOrdinal + KAPPA
      const { mu: muSum, sigSq } = team.reduce<TeamSums>(
        (a, { mu, sigma }, j) => {
          const factor = 1 + (maxOrdinal - ordinals[j]) / denom
          a.mu += mu * factor
          const s = sigma * factor
          a.sigSq += s * s
          return a
        },
        { mu: 0, sigSq: 0 }
      )
      return [muSum, sigSq, team, rank[i]]
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

/**
 * `c`: total uncertainty across all teams in the game.
 *
 * Defined as sqrt( Σ_q (σ²_q + β²) ) where the sum runs over every team in
 * the game. Used as the normalizing scale in every model's update equations.
 *
 * Reference: Weng & Lin (2011), "A Bayesian Approximation Method for Online
 * Ranking", JMLR 12, sec. 3 (eq. for c_q).
 */
const utilC = (options: Options) => {
  const { BETASQ } = constants(options)
  return (teamRatings: TeamRating[]) =>
    Math.sqrt(teamRatings.map(([_teamMu, teamSigmaSq, _team, _rank]) => teamSigmaSq + BETASQ).reduce(sum, 0))
}

/**
 * `sumQ[q]`: Plackett-Luce normalizer for team `q` — the sum of exp(μ_i / c)
 * over every team `i` whose rank is at or worse than team q's rank
 * (i.e. teams that placed equal or below q).
 *
 * Reference: Weng & Lin (2011), Plackett-Luce derivation (sec. 3.2).
 */
export const utilSumQ = (teamRatings: TeamRating[], c: number) =>
  teamRatings.map(([_qMu, _qSigmaSq, _qTeam, qRank]) =>
    teamRatings
      .filter(([_iMu, _iSigmaSq, _iTeam, iRank]) => iRank >= qRank)
      .map(([iMu, _iSigmaSq, _iTeam, _iRank]) => Math.exp(iMu / c))
      .reduce(sum, 0)
  )

/**
 * `A[i]`: size of the rank-tie group containing team `i` — i.e. the number of
 * teams (including `i` itself) sharing rank `i`'s placement. Used by
 * Plackett-Luce to scale ω/Δ contributions from ties.
 *
 * Reference: Weng & Lin (2011), Plackett-Luce tie handling (sec. 3.2).
 */
export const utilA = (teamRatings: TeamRating[]) =>
  teamRatings.map(
    ([_iMu, _iSigmaSq, _iTeam, iRank]) =>
      teamRatings.filter(([_qMu, _qSigmaSq, _qTeam, qRank]) => iRank === qRank).length
  )

// default to iSigma / c
const defaultGamma: Gamma = (c: number, _k: number, _mu: number, sigmaSq: number, _team: Rating[], _qRank: number) =>
  Math.sqrt(sigmaSq) / c

export const gamma = (options: Options): Gamma => options.gamma ?? defaultGamma

export default (options: Options) => ({
  utilC: utilC(options),
  teamRating: teamRating(options),
  gamma: gamma(options),
})
