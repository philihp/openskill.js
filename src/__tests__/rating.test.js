import { rating } from '..'

describe('rating', () => {
  it('defaults mu to 25.0', () => {
    const { mu } = rating()
    expect(mu).toBe(25.0)
  })

  it('defaults sigma to 8.333', () => {
    const { sigma } = rating()
    expect(sigma).toBe(8.333333333333334)
  })

  it('accepts a new mu', () => {
    const { mu } = rating({ mu: 42 })
    expect(mu).toBe(42)
  })

  it('accepts a new sigma', () => {
    const { sigma } = rating({ sigma: 6.283185 })
    expect(sigma).toBe(6.283185)
  })
})
