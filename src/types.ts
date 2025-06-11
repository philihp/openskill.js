export type Rating = {
  mu: number
  sigma: number
}

export type Team = Rating[]

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
  alpha?: number
  target?: number
  preventSigmaIncrease?: boolean // deprecated, use limitSigma, this will go away someday
  limitSigma?: boolean
}
