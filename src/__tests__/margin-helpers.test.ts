import { describe, it, expect } from '#test-helpers'
import { marginAdjustedMus, marginDivisor, marginDivisors } from '../margin'

describe('marginDivisor', () => {
  it('returns 1 when the score difference is within the margin', () => {
    expect.assertions(3)
    expect(marginDivisor(5)(3, 3)).toBe(1)
    expect(marginDivisor(5)(10, 5)).toBe(1)
    expect(marginDivisor(5)(5, 10)).toBe(1)
  })

  it('returns log1p(difference / margin) when the difference is more than the margin', () => {
    expect.assertions(2)
    expect(marginDivisor(5)(20, 5)).toBe(Math.log1p(3))
    expect(marginDivisor(5)(5, 20)).toBe(Math.log1p(3))
  })

  it('returns 1 when the margin is 0 or less', () => {
    expect.assertions(2)
    expect(marginDivisor(0)(20, 5)).toBe(1)
    expect(marginDivisor(-1)(20, 5)).toBe(1)
  })
})

describe('marginDivisors', () => {
  it('returns 1 for every pair without score or margin', () => {
    expect.assertions(2)
    expect(marginDivisors({ margin: 2 }, 2)(0, 1)).toBe(1)
    expect(marginDivisors({ score: [10, 0] }, 2)(0, 1)).toBe(1)
  })

  it('returns 1 for every pair when there is not one score for each team', () => {
    expect.assertions(1)
    expect(marginDivisors({ score: [10, 0], margin: 2 }, 3)(0, 1)).toBe(1)
  })

  it('looks up the scores of the two teams', () => {
    expect.assertions(2)
    const divisor = marginDivisors({ score: [10, 0, 9], margin: 2 }, 3)
    expect(divisor(0, 1)).toBe(Math.log1p(5))
    expect(divisor(0, 2)).toBe(1)
  })
})

describe('marginAdjustedMus', () => {
  it('returns the same mu values when the margin has no effect', () => {
    expect.assertions(2)
    const mus = [30, 20]
    expect(marginAdjustedMus({ score: [10, 0] }, mus)).toBe(mus)
    expect(marginAdjustedMus({ margin: 2 }, mus)).toBe(mus)
  })

  it('moves each mu by the mean of (qMu - iMu) * (divisor - 1)', () => {
    expect.assertions(1)
    // scores 10, 0 and 9 with margin 2: pairs (0, 1) and (1, 2) are outside
    // the margin. Pair (0, 2) is inside it, so its term is 0, but it counts.
    const f01 = Math.log1p(10 / 2) - 1
    const f12 = Math.log1p(9 / 2) - 1
    const expected = [
      30 + ((20 - 30) * f01 + 0) / 2,
      20 + ((30 - 20) * f01 + (25 - 20) * f12) / 2,
      25 + (0 + (20 - 25) * f12) / 2,
    ]
    expect(marginAdjustedMus({ score: [10, 0, 9], margin: 2 }, [30, 20, 25])).toStrictEqual(expected)
  })

  it('does not count opponents with the same score', () => {
    expect.assertions(1)
    expect(marginAdjustedMus({ score: [5, 5], margin: 2 }, [30, 20])).toStrictEqual([30, 20])
  })
})
