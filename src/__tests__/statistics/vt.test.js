import { vt } from '../../statistics'

describe('statistics#vt', () => {
  it('with small b, small x', () => {
    expect(vt(-1000, -100)).toBe(1100)
  })

  it('with small b, big x', () => {
    expect(vt(1000, -100)).toBe(-1100)
  })

  it('with big b, small x', () => {
    expect(vt(-1000, 1000)).toBe(0.7978845368663289)
  })

  it('with big b, big x', () => {
    expect(vt(0, 1000) < 0.000000001).toBe(true)
  })
})
