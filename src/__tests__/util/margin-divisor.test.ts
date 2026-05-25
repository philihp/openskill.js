import { marginDivisor, plMarginAdjustedMu } from '../../util'

describe('marginDivisor', () => {
  it('returns 1 when score is undefined', () => {
    expect(marginDivisor(undefined as unknown as number[], 5, 0, 1)).toBe(1)
  })

  it('returns 1 when margin is 0', () => {
    expect(marginDivisor([10, 2], 0, 0, 1)).toBe(1)
  })

  it('returns 1 when margin is negative', () => {
    expect(marginDivisor([10, 2], -1, 0, 1)).toBe(1)
  })

  it('returns 1 when score diff is less than margin', () => {
    expect(marginDivisor([5, 2], 5, 0, 1)).toBe(1)
  })

  it('returns 1 when score diff equals margin', () => {
    expect(marginDivisor([6, 1], 5, 0, 1)).toBe(1)
  })

  it('returns log1p when score diff exceeds margin', () => {
    const result = marginDivisor([20, 1], 5, 0, 1)
    expect(result).toBe(Math.log1p(19 / 5))
    expect(result).toBeGreaterThan(1)
  })
})

describe('plMarginAdjustedMu', () => {
  const teamRatings: [number, number, { mu: number; sigma: number }[], number][] = [
    [32, 25, [{ mu: 32, sigma: 5 }], 0],
    [18, 36, [{ mu: 18, sigma: 6 }], 1],
  ]

  it('returns unchanged mus when margin is 0', () => {
    const result = plMarginAdjustedMu(teamRatings, [20, 1], 0)
    expect(result).toStrictEqual([32, 18])
  })

  it('returns unchanged mus when no scores', () => {
    const result = plMarginAdjustedMu(teamRatings, undefined as unknown as number[], 5)
    expect(result).toStrictEqual([32, 18])
  })

  it('adjusts mu for blowout margin', () => {
    const result = plMarginAdjustedMu(teamRatings, [20, 1], 5)
    // margin factor narrows effective mu gap; outperformer's mu decreases
    expect(result[0]).toBeLessThan(32)
    expect(result[1]).toBeGreaterThan(18)
  })
})
