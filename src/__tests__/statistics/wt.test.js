import { WT } from '../../statistics'

describe('statistics#wt', () => {
  const wt = WT({})

  it('wt(1,2)', () => {
    expect.assertions(1)
    expect(wt(1, 2)).toBe(0.38385826878672835)
  })

  it('wt(0,2)', () => {
    expect.assertions(1)
    expect(wt(0, 2)).toBe(0.22625869547437663)
  })

  it('wt(0,-1)', () => {
    expect.assertions(1)
    expect(wt(0, -1)).toBe(1)
  })

  it('wt(0,0)', () => {
    expect.assertions(1)
    expect(wt(0, 0)).toBe(1.0)
  })

  it('wt(0,10)', () => {
    expect.assertions(1)
    expect(wt(0, 10)).toBeCloseTo(0)
  })
})
