import { vt } from '../../statistics'

describe('statistics#vt', () => {
  it('with small b, small x', () => {
    expect(vt(-1000, -100)).toBe(1100)
  })

  it('with small b, big x', () => {
    expect(vt(1000, -100)).toBe(-1100)
  })

  it('with big b, small x', () => {
    expect(vt(-1000, 1000)).toBeCloseTo(0.79788)
  })

  it('with big b, big x', () => {
    expect(vt(0, 1000)).toBeCloseTo(0)
  })
})
