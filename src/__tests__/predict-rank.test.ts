import { describe, it, expect } from '#test-helpers'
import { rating, predictRank, predictWin } from '..'

describe('predictRank', () => {
  const precision = 7

  const newbie = rating()
  const strong = rating({ mu: 45, sigma: 2 })
  const weak = rating({ mu: 10, sigma: 3 })

  // ---------------------------------------------------------------------------
  // Python-equivalent tests — same rating values and assertions as
  // test_predict_rank in openskill.py (all five model test files).
  //
  // Python raises ValueError for a single team; JS returns [[1, NaN]] because
  // predictWin divides by n*(n-1)/2 which is 0 when n=1.
  // ---------------------------------------------------------------------------

  it('probabilities of mixed-skill teams sum to 1 (Python parity)', () => {
    expect.assertions(1)
    const a1 = rating({ mu: 34, sigma: 0.25 })
    const a2 = rating({ mu: 32, sigma: 0.25 })
    const a3 = rating({ mu: 30, sigma: 0.25 })
    const b1 = rating({ mu: 24, sigma: 0.5 })
    const b2 = rating({ mu: 22, sigma: 0.5 })
    const b3 = rating({ mu: 20, sigma: 0.5 })
    const teams = [
      [a1, b1],
      [a2, b2],
      [a3, b3],
    ]
    const ranks = predictRank(teams)
    const totalProbability = ranks.reduce((acc, [, prob]) => acc + prob, 0)
    expect(totalProbability).toBeCloseTo(1, precision)
  })

  it('probabilities of identical teams sum to 1 (Python parity)', () => {
    expect.assertions(1)
    const a1 = rating({ mu: 34, sigma: 0.25 })
    const b1 = rating({ mu: 24, sigma: 0.5 })
    const team = [a1, b1]
    const ranks = predictRank([team, team, team])
    const totalProbability = ranks.reduce((acc, [, prob]) => acc + prob, 0)
    expect(totalProbability).toBeCloseTo(1, precision)
  })

  // Python raises ValueError for a single team; JS returns [[1, NaN]] instead.
  it('single team returns NaN probability (JS differs from Python ValueError)', () => {
    expect.assertions(2)
    const a1 = rating({ mu: 34, sigma: 0.25 })
    const b1 = rating({ mu: 24, sigma: 0.5 })
    const [[rank, prob]] = predictRank([[a1, b1]])
    expect(rank).toBe(1)
    expect(prob).toBeNaN()
  })

  it('returns one [rank, probability] tuple per team', () => {
    expect.assertions(1)
    const result = predictRank([[newbie], [newbie]])
    expect(result).toHaveLength(2)
  })

  it('probabilities match predictWin', () => {
    expect.assertions(3)
    const teams = [[strong], [newbie], [weak]]
    const ranks = predictRank(teams)
    const winProbs = predictWin(teams)
    ranks.forEach(([, prob], i) => {
      expect(prob).toBeCloseTo(winProbs[i], precision)
    })
  })

  it('strongest team gets rank 1', () => {
    expect.assertions(3)
    const [[rank1], [rank2], [rank3]] = predictRank([[strong], [newbie], [weak]])
    expect(rank1).toBe(1)
    expect(rank2).toBe(2)
    expect(rank3).toBe(3)
  })

  it('all equal teams get rank 1 (tied)', () => {
    expect.assertions(3)
    const [[r1], [r2], [r3]] = predictRank([[newbie], [newbie], [newbie]])
    expect(r1).toBe(1)
    expect(r2).toBe(1)
    expect(r3).toBe(1)
  })

  it('two-team match ranks winner first', () => {
    expect.assertions(2)
    const [[rank1], [rank2]] = predictRank([[strong], [weak]])
    expect(rank1).toBe(1)
    expect(rank2).toBe(2)
  })

  it('rank is independent of input order', () => {
    expect.assertions(2)
    const fwd = predictRank([[strong], [weak]])
    const rev = predictRank([[weak], [strong]])
    expect(fwd[0][0]).toBe(1) // strong first → rank 1
    expect(rev[1][0]).toBe(1) // strong second → still rank 1
  })

  it('ignores passed ranks (predicts from skill, not from match result)', () => {
    expect.assertions(1)
    const withRank = predictRank([[strong], [weak]], { rank: [2, 1] })
    const withoutRank = predictRank([[strong], [weak]])
    expect(withRank).toStrictEqual(withoutRank)
  })

  it('four teams ranked by descending win probability', () => {
    expect.assertions(4)
    const r1 = rating({ mu: 40, sigma: 2 })
    const r2 = rating({ mu: 30, sigma: 2 })
    const r3 = rating({ mu: 20, sigma: 2 })
    const r4 = rating({ mu: 10, sigma: 2 })
    const [[rank1], [rank2], [rank3], [rank4]] = predictRank([[r1], [r2], [r3], [r4]])
    expect(rank1).toBe(1)
    expect(rank2).toBe(2)
    expect(rank3).toBe(3)
    expect(rank4).toBe(4)
  })

  it('two teams share rank when probabilities are equal', () => {
    expect.assertions(2)
    const a = rating({ mu: 25, sigma: 5 })
    const b = rating({ mu: 25, sigma: 5 })
    const c = rating({ mu: 10, sigma: 5 })
    const [[rA], [rB]] = predictRank([[a], [b], [c]])
    expect(rA).toBe(1)
    expect(rB).toBe(1)
  })
})
