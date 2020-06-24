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
    expect.assertions(1)
    const { mu } = rating({ mu: 42 })
    expect(mu).toBe(42)
  })

  it('accepts a new sigma', () => {
    expect.assertions(1)
    const { sigma } = rating({ sigma: 6.283185 })
    expect(sigma).toBe(6.283185)
  })
})
