import { describe, it, expect } from '#test-helpers'
import { rating } from '..'

describe('rating', () => {
  it('defaults mu to 25.0', () => {
    expect.assertions(1)
    const { mu } = rating()
    expect(mu).toBe(25.0)
  })

  it('defaults sigma to 8.333', () => {
    expect.assertions(1)
    const { sigma } = rating()
    expect(sigma).toBeCloseTo(8.333)
  })

  it('accepts a new mu without changing default sigma', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({ mu: 42 })
    expect(mu).toBe(42)
    expect(sigma).toBeCloseTo(25 / 3)
  })

  it('accepts a new sigma', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({ sigma: 6.283185 })
    expect(mu).toBe(25)
    expect(sigma).toBe(6.283185)
  })

  it('can initialize a mu of zero without changing default sigma', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({ mu: 0 })
    expect(mu).toBe(0)
    expect(sigma).toBeCloseTo(25 / 3)
  })

  it('can initialize a sigma of zero', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({ sigma: 0 })
    expect(mu).toBe(25)
    expect(sigma).toBe(0)
  })

  it('z option no longer affects default sigma', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({}, { z: 5 })
    expect(mu).toBe(25)
    expect(sigma).toBeCloseTo(25 / 3)
  })

  it('z option no longer affects default sigma even with custom mu', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({ mu: 15 }, { z: 3 })
    expect(mu).toBe(15)
    expect(sigma).toBeCloseTo(25 / 3)
  })

  it('explicit sigma is honored regardless of z', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({ sigma: 5 }, { z: 3 })
    expect(mu).toBe(25)
    expect(sigma).toBe(5)
  })
})
