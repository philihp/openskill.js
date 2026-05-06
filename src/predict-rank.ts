import predictWin from './predict-win'
import { Options, Team } from './types'

const predictRank = (teams: Team[], options: Options = {}): [number, number][] => {
  const winProbs = predictWin(teams, options)
  return winProbs.map((prob, _, all) => [1 + all.filter((q) => q > prob).length, prob])
}

export default predictRank
