import constants from './constants'
import util from './util'
import { phiMajor } from './statistics'
import { Options, Team } from './types'

const predictWin = (teams: Team[], options: Options = {}) => {
  const { teamRating } = util(options)
  const { BETASQ } = constants(options)

  const teamRatings = teamRating(teams)
  const n = teams.length
  const denom = (n * (n - 1)) / 2

  // phiMajor is symmetric: phiMajor(-x) === 1 - phiMajor(x), and the
  // sqrt(n·β² + σ²_A + σ²_B) denominator is symmetric in (A,B). Compute
  // the upper-triangle once and add the complementary mass to the lower.
  const wins = new Array(n).fill(0) as number[]
  for (let i = 0; i < n; i++) {
    const [muA, sigmaSqA] = teamRatings[i]
    for (let j = i + 1; j < n; j++) {
      const [muB, sigmaSqB] = teamRatings[j]
      const p = phiMajor((muA - muB) / Math.sqrt(n * BETASQ + sigmaSqA + sigmaSqB))
      wins[i] += p
      wins[j] += 1 - p
    }
  }
  return wins.map((w) => w / denom)
}

export default predictWin
