import { rating, ordinal } from '..'

describe('ordinal', () => {
  it('converts a rating into an ordinal', () => {
    expect.assertions(1)
    const result = ordinal({
      mu: 5.0,
      sigma: 2.0,
    })
    expect(result).toBe(-1.0)
  })

  it('respects alpha and target parameters', () => {
    expect.assertions(1)
    // Mimic ELO range (alpha = 200 / sigma = 200 / (25 / 3))
    const options = { alpha: 24.0, target: 1500.0 }
    const player = rating({ mu: 24.0, sigma: 6.0 })
    const result = ordinal(player, options)
    expect(result).toBe(1644.0)
  })

  it('respects a custom Z', () => {
    expect.assertions(1)
    const options = { z: 2 }
    const player = rating({ mu: 24.0, sigma: 6.0 }, options)
    const result = ordinal(player, options)
    expect(result).toBe(12.0)
  })
})
