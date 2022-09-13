export type Rating = {
  mu: number
  sigma: number
}

export type Gamma = (
  c: number,
  k: number,
  mu: number,
  sigmaSq: number,
  team: Rating[],
  qRank: number
) => number

// eslint-disable-next-line no-use-before-define
export type Model = (teams: Rating[][], options: Options) => Rating[][]

export type Options = {
  z?: number
  mu?: number
  sigma?: number
  epsilon?: number
  gamma?: () => number
  beta?: number
  model?: Model
  rank?: number[]
  score?: number[]
  weight?: number[][]
  tau?: number
  preventSigmaIncrease?: boolean
}
