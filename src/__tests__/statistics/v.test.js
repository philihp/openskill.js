import { v } from '../../statistics'

describe('statistics#v', () => {
  it('v(1,2)', () => {
    expect(v(1, 2)).toBe(1.5251352044082924)
  })

  it('v(0,2)', () => {
    expect(v(0, 2)).toBe(2.3732157475120528)
  })

  it('v(0,-1)', () => {
    expect(v(0, -1)).toBe(0.2875999734906994)
  })

  it('denominator less than threshold', () => {
    expect(v(0, 10)).toBe(10)
  })
})
