import constants, { tau } from '../constants'

describe('constants', () => {
  describe('tau', () => {
    it('defaults to mu/300', () => {
      expect.assertions(1)
      expect(tau({})).toBeCloseTo(0.08333333)
    })
    it('is included in default export', () => {
      expect.assertions(1)
      expect(constants({}).TAU).toBeCloseTo(0.08333333)
    })
    it('defaults to not limiting sigma', () => {
      expect.assertions(1)
      const { LIMIT_SIGMA } = constants({})
      expect(LIMIT_SIGMA).toBeFalsy()
    })
  })
})
