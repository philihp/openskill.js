import { describe, it, expect } from '#test-helpers'
import { marginAmp, marginFactor } from '../margin'

describe('marginAmp', () => {
  it('returns 0 when the score difference is within the margin', () => {
    expect.assertions(2)
    expect(marginAmp(0, 5)).toBe(0)
    expect(marginAmp(5, 5)).toBe(0)
  })

  it('grows logarithmically with the excess over the margin', () => {
    expect.assertions(1)
    expect(marginAmp(15, 5)).toBeCloseTo(Math.log1p(10), 12)
  })
})

describe('marginFactor', () => {
  it('returns 1 for a single team (degenerate case)', () => {
    expect.assertions(1)
    expect(marginFactor([10], 0, 5)).toBe(1)
  })

  it('returns 1 when every opponent is within the margin', () => {
    expect.assertions(1)
    expect(marginFactor([10, 12, 8], 0, 5)).toBe(1)
  })

  it('averages the per-opponent amplification', () => {
    expect.assertions(1)
    // i = 0, score 20, opponents 10 and 8, margin 5
    // amps: log1p(20-10-5)=log1p(5), log1p(20-8-5)=log1p(7)
    // factor = 1 + (log1p(5) + log1p(7)) / 2
    const expected = 1 + (Math.log1p(5) + Math.log1p(7)) / 2
    expect(marginFactor([20, 10, 8], 0, 5)).toBeCloseTo(expected, 12)
  })
})
