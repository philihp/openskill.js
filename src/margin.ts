import { addIndex, always, map, range, sum } from 'ramda'
import { Options } from './types'

/**
 * The margin divisor for one pair of scores, as in openskill.py 6.2.0.
 *
 * When the absolute score difference is more than `margin`, it is
 * `log1p(difference / margin)`. Otherwise it is 1, and the pair is an ordinary
 * win, loss or draw. A `margin` of 0 or less always gives 1.
 */
export const marginDivisor =
  (margin: number) =>
  (iScore: number, qScore: number): number => {
    const scoreDiff = Math.abs(iScore - qScore)
    return margin > 0 && scoreDiff > margin ? Math.log1p(scoreDiff / margin) : 1
  }

/**
 * The scores that the margin uses, or `undefined` when the margin has no
 * effect. openskill.py uses the scores only when there is one score for each
 * team. A margin of 0 or less gives a divisor of 1 for every pair, which is
 * the same as no margin.
 */
const marginScores = ({ score, margin = 0 }: Options, teamCount: number): number[] | undefined =>
  margin > 0 && score?.length === teamCount ? score : undefined

const noMargin = always(1)

/**
 * For the pairwise models: a function of two team indexes that gives the
 * divisor for the difference in mu between those teams. Each pairwise model
 * divides `iMu - qMu` by this value before it computes the expected result.
 */
export const marginDivisors = (options: Options, teamCount: number): ((i: number, q: number) => number) => {
  const scores = marginScores(options, teamCount)
  if (scores === undefined) return noMargin
  const divisor = marginDivisor(options.margin ?? 0)
  return (i, q) => divisor(scores[i], scores[q])
}

const mapIndexed = addIndex<number, number>(map)

/**
 * For Plackett-Luce: the team mu values with the margin adjustment of
 * openskill.py 6.2.0. For each opponent with a different score, a team adds
 * `(qMu - iMu) * (divisor - 1)`. The adjustment is the mean of these terms,
 * and 0 when all scores are the same. When the margin has no effect, the mu
 * values do not change.
 */
export const marginAdjustedMus = (options: Options, mus: number[]): number[] => {
  const scores = marginScores(options, mus.length)
  if (scores === undefined) return mus
  const divisor = marginDivisor(options.margin ?? 0)
  const indexes = range(0, mus.length)
  return mapIndexed((iMu, i) => {
    const opponents = indexes.filter((q) => q !== i && Math.abs(scores[i] - scores[q]) > 0)
    const terms = opponents.map((q) => (mus[q] - iMu) * (divisor(scores[i], scores[q]) - 1))
    return iMu + (terms.length > 0 ? sum(terms) / terms.length : 0)
  }, mus)
}
