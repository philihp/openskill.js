import { w } from '../../statistics'

describe('statistics#w', () => {
  it('w(1,2)', () => {
    expect.assertions(1)
    expect(w(1, 2)).toBe(0.8009021873172315)
  })

  it('w(0,2)', () => {
    expect.assertions(1)
    expect(w(0, 2)).toBe(0.8857214892150859)
  })

  it('w(0,-1)', () => {
    expect.assertions(1)
    expect(w(0, -1)).toBe(0.3703137182425503)
  })

  it('denominator less than threshold', () => {
    expect.assertions(1)
    expect(w(0, 10)).toBe(0)
  })

  it('tiny denom, negative x', () => {
    expect.assertions(1)
    expect(w(-1, 10)).toBe(1)
  })
})
