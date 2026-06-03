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
