import { v } from '../../statistics'

describe('statistics#v', () => {
  it('v(1,2)', () => {
    expect.assertions(1)
    expect(v(1, 2)).toBe(1.525135276160981)
  })

  it('v(0,2)', () => {
    expect.assertions(1)
    expect(v(0, 2)).toBe(2.37321553282284)
  })

  it('v(0,-1)', () => {
    expect.assertions(1)
    expect(v(0, -1)).toBe(0.2875999709391784)
  })

  it('denominator less than threshold', () => {
    expect.assertions(1)
    expect(v(0, 10)).toBe(10)
  })
})
