import { reduce } from 'ramda'
import constants from './constants'
import util from './util'
import { phiMajor } from './statistics'
import { Options, Team } from './types'

// Lazily yield every unordered pair (i, j) with i < j over [0, n).
// Used by predictWin to walk the upper triangle without materializing
// the n²/2 pair list that xprod+filter would build eagerly.
function* upperTrianglePairs(n: number): Generator<[number, number]> {
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      yield [i, j]
    }
  }
}

const predictWin = (teams: Team[], options: Options = {}) => {
  const { teamRating } = util(options)
  const { BETASQ } = constants(options)

  const teamRatings = teamRating(teams)
  const n = teams.length
  const denom = (n * (n - 1)) / 2

  // phiMajor is symmetric: phiMajor(-x) === 1 - phiMajor(x), and the
  // sqrt(n·β² + σ²_A + σ²_B) denominator is symmetric in (A, B). Walk only
  // the upper-triangle pair stream and add the complementary mass to the
  // lower index — halves both Math.sqrt and phiMajor calls.
  const wins = reduce<[number, number], number[]>(
    (acc, [i, j]) => {
      const [muA, sigmaSqA] = teamRatings[i]
      const [muB, sigmaSqB] = teamRatings[j]
      const p = phiMajor((muA - muB) / Math.sqrt(n * BETASQ + sigmaSqA + sigmaSqB))
      acc[i] += p
      acc[j] += 1 - p
      return acc
    },
    new Array(n).fill(0),
    upperTrianglePairs(n) as unknown as [number, number][]
  )

  return wins.map((w) => w / denom)
}

export default predictWin
