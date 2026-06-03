export type Rating = {
  mu: number
  sigma: number
}

export type Team = Rating[]

// Teams is the input shape accepted by rate(): a list of teams, each team a
// list of ratings. It is declared with `readonly` so that `const` type
// parameters can capture the exact tuple lengths of literal arguments.
export type Teams = readonly (readonly Rating[])[]

// RateTeam replaces every rating in a single team with a freshly computed
// Rating while preserving the team's length. U is a naked type parameter so the
// mapped type stays homomorphic and keeps the array/tuple structure intact.
export type RateTeam<U extends readonly Rating[]> = {
  -readonly [J in keyof U]: Rating
}

// RateResult mirrors the shape of the input teams: the same number of teams,
// and within each team the same number of ratings, with every rating replaced
// by a freshly computed Rating. Homomorphic mapped types preserve tuple lengths
// when the input was inferred as a tuple (e.g. an array literal captured by a
// `const` type parameter), while a plain Rating[][] maps back to Rating[][].
export type RateResult<T extends Teams> = {
  -readonly [K in keyof T]: RateTeam<T[K]>
}

export type Rank = number

export type Gamma = (c: number, k: number, mu: number, sigmaSq: number, team: Rating[], qRank: number) => number

export type Model = (teams: Team[], options?: Options) => Team[]

export type Options = {
  z?: number
  mu?: number
  sigma?: number
  epsilon?: number
  gamma?: Gamma
  beta?: number
  model?: Model
  rank?: Rank[]
  score?: number[]
  weight?: number[][]
  tau?: number
  margin?: number
  alpha?: number
  target?: number
  limitSigma?: boolean
  balance?: boolean
  kappa?: number
}
