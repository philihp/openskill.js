import { score } from '../../util'

describe('util#score', () => {
  it('returns 1.0 on wins', () => {
    expect.assertions(1)
    expect(score(2, 1)).toBe(1.0)
  })

  it('returns 1.0 on big win', () => {
    expect.assertions(1)
    expect(score(34, 6)).toBe(1.0) // 2019-08-31
  })

  it('returns 0.0 on losses', () => {
    expect.assertions(1)
    expect(score(1, 2)).toBe(0.0)
  })

  it('returns 1.0 on big loss', () => {
    expect.assertions(1)
    expect(score(3, 58)).toBe(0.0) // 2018-12-01
  })

  it('returns 0.5 on ties', () => {
    expect.assertions(1)
    expect(score(1, 1)).toBe(0.5)
  })
})
