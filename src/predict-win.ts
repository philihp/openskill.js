import { chain, map, range, reduce } from 'ramda'
import constants from './constants'
import util from './util'
import { phiMajor } from './statistics'
import { Options, Team } from './types'

// Every unordered pair (i, j) with i < j over [0, n), built tacitly via
// chain (flatMap). Eager allocation of n²/2 pair tuples; for predictWin's
// typical n this is negligible.
const upperTrianglePairs = (n: number): [number, number][] =>
  chain((i: number) => map((j: number): [number, number] => [i, j], range(i + 1, n)), range(0, n))

const predictWin = (teams: Team[], options: Options = {}) => {
  const { teamRating } = util(options)
  const { BETASQ } = constants(options)

  const teamRatings = teamRating(teams)
  const n = teams.length
  const denom = (n * (n - 1)) / 2

  // phiMajor is symmetric: phiMajor(-x) === 1 - phiMajor(x), and the
  // sqrt(n·β² + σ²_A + σ²_B) denominator is symmetric in (A, B). Walk only
  // the upper triangle and add the complementary mass to the lower index —
  // halves both Math.sqrt and phiMajor calls.
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
    upperTrianglePairs(n)
  )

  return wins.map((w) => w / denom)
}

export default predictWin
