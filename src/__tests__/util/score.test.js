import { score } from '../../util'

describe('util#score', () => {
  it('score returns 1.0 on wins', () => {
    expect.assertions(1)
    expect(score(2, 1)).toBe(1.0)
  })

  it('score returns 0.0 on losses', () => {
    expect.assertions(1)
    expect(score(1, 2)).toBe(0.0)
  })

  it('score returns 0.5 on ties', () => {
    expect.assertions(1)
    expect(score(1, 1)).toBe(0.5)
  })
})
