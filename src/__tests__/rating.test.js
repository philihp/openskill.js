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

  it('accepts a new mu', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({ mu: 42 })
    expect(mu).toBe(42)
    expect(sigma).toBeCloseTo(42 / 3)
  })

  it('accepts a new sigma', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({ sigma: 6.283185 })
    expect(mu).toBe(25)
    expect(sigma).toBe(6.283185)
  })

  it('can initialize a mu of zero', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({ mu: 0 })
    expect(mu).toBe(0)
    expect(sigma).toBe(0)
  })

  it('can initialize a sigma of zero', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({ sigma: 0 })
    expect(mu).toBe(25)
    expect(sigma).toBe(0)
  })

  it('can initialize with a different Z', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({}, { z: 5 })
    expect(mu).toBe(25)
    expect(sigma).toBe(5)
  })

  it('can initialize with a different Z and mu', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({ mu: 15 }, { z: 3 })
    expect(mu).toBe(15)
    expect(sigma).toBe(5)
  })

  it('can initialize with a different Z and sigma', () => {
    expect.assertions(2)
    const { mu, sigma } = rating({ sigma: 5 }, { z: 3 })
    expect(mu).toBe(25)
    expect(sigma).toBe(5)
  })
})
