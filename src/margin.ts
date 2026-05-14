/**
 * Amplification contribution from a single score difference.
 *
 * Returns 0 when the absolute score gap is within the margin threshold;
 * otherwise grows logarithmically with the excess. log1p is used so that
 * large blowouts don't produce runaway factors.
 */
export const marginAmp = (absDiff: number, margin: number): number => Math.log1p(Math.max(0, absDiff - margin))

/**
 * Per-team amplification factor used by `rate()` when both `score` and
 * `margin` are supplied. Averages `marginAmp` across all opponents and
 * adds 1 so that an in-margin (no-amp) result leaves rating updates
 * unchanged.
 */
export const marginFactor = (scores: number[], i: number, margin: number): number => {
  const n = scores.length
  if (n <= 1) return 1
  const si = scores[i]
  const sum = scores.reduce((acc, sj, j) => (j === i ? acc : acc + marginAmp(Math.abs(si - sj), margin)), 0)
  return 1 + sum / (n - 1)
}
