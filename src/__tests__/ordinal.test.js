import { ordinal } from '..'

describe('ordinal', () => {
  it('converts a rating into an ordinal', () => {
    const result = ordinal({
      mu: 5.0,
      sigma: 2.0,
    })
    expect(result).toBe(-1.0)
  })
})
