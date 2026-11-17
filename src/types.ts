export type Rating = {
  mu: number
  sigma: number
}

export type Team = Rating[]

export type Teams = readonly (readonly Rating[])[]

export type RateTeam<U extends readonly Rating[]> = {
  -readonly [J in keyof U]: Rating
}

export type RateResult<T extends Teams> = {
  -readonly [K in keyof T]: RateTeam<T[K]>
}

export type Rank = number

export type Gamma = (
  c: number,
  k: number,
  mu: number,
  sigmaSq: number,
  team: readonly Rating[],
  qRank: number
) => number

/**
 * The teams that `rate` gives to a model. They are read-only: a model must
 * not change them. It must return new teams with new ratings.
 */
export type ModelTeams = readonly (readonly Readonly<Rating>[])[]

export type Model = (teams: ModelTeams, options?: Options) => Team[]

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
  weightBounds?: [number, number] | null
  tau?: number
  margin?: number
  alpha?: number
  target?: number
  limitSigma?: boolean
  balance?: boolean
  kappa?: number
  windowSize?: number
}
