export type Rating = {
  mu: number
  sigma: number
}

export type Model =
  | 'thurstoneMostellerPart'
  | 'thurstoneMostellerFull'
  | 'bradleyTerryPart'
  | 'bradleyTerryFull'
  | 'plackettLuce'

export type Options = {
  z?: number
  mu?: number
  sigma?: number
  epsilon?: number
  gamma?: number
  beta?: number
  model?: Model
  rank?: number[]
  score?: number[]
  tau?: number
  preventSigmaIncrease?: boolean
}
