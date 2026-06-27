import { describe, it, expect } from '#test-helpers'
import constants from '../constants'

describe('constants', () => {
  describe('z', () => {
    it('defaults to 3', () => {
      expect.assertions(1)
      const env = constants({})
      expect(env).toMatchObject({
        Z: 3,
      })
    })
    it('accepts z override without affecting beta', () => {
      expect.assertions(1)
      const env = constants({ z: 2 })
      expect(env).toMatchObject({
        BETA: 25 / 6,
        Z: 2,
      })
    })
  })

  describe('mu', () => {
    it('defaults to 25', () => {
      expect.assertions(1)
      const env = constants({})
      expect(env).toMatchObject({
        MU: 25,
      })
    })
    it('accepts mu override without affecting beta/tau', () => {
      expect.assertions(1)
      const env = constants({ mu: 300 })
      expect(env).toMatchObject({
        MU: 300,
        BETA: 25 / 6,
        TAU: 25 / 300,
        Z: 3,
      })
    })
  })

  describe('tau', () => {
    it('is included in default export', () => {
      expect.assertions(1)
      expect(constants({}).TAU).toBeCloseTo(0.08333333)
    })
    it('accepts tau override', () => {
      expect.assertions(1)
      const env = constants({ tau: 0.0042 })
      expect(env).toMatchObject({
        TAU: 0.0042,
      })
    })
  })

  describe('sigma', () => {
    it('defaults to 8.333333333333334', () => {
      const env = constants({})
      expect(env.SIGMA).toBeCloseTo(8.333333333333334)
    })
    it('accepts sigma override without affecting beta', () => {
      expect.assertions(1)
      const env = constants({ sigma: 7 })
      expect(env).toMatchObject({
        SIGMA: 7,
        BETA: 25 / 6,
      })
    })
  })

  describe('epsilon', () => {
    it('defaults to 0.1', () => {
      expect.assertions(1)
      const env = constants({})
      expect(env).toMatchObject({
        EPSILON: 0.1,
      })
    })
    it('accepts epsilon override', () => {
      expect.assertions(1)
      const env = constants({ epsilon: 0.001 })
      expect(env).toMatchObject({
        EPSILON: 0.001,
      })
    })
  })

  describe('beta', () => {
    it('defaults to 4.166666666666667', () => {
      expect.assertions(1)
      const env = constants({})
      expect(env.BETA).toBeCloseTo(4.166666666666667)
    })
    it('accepts beta override', () => {
      expect.assertions(1)
      const env = constants({ beta: 100 })
      expect(env).toMatchObject({
        BETA: 100,
        BETASQ: 10000,
      })
    })
  })

  describe('betaSq', () => {
    it('defaults to 17.361111111111114', () => {
      expect.assertions(1)
      const env = constants({})
      expect(env.BETASQ).toBeCloseTo(17.361111111111114)
    })
  })

  describe('limitSigma', () => {
    it('defaults to not limiting sigma', () => {
      expect.assertions(1)
      const { LIMIT_SIGMA } = constants({})
      expect(LIMIT_SIGMA).toBeFalsy()
    })
    it('accepts limitSigma flag', () => {
      expect.assertions(1)
      const env = constants({ limitSigma: true })
      expect(env).toMatchObject({
        LIMIT_SIGMA: true,
      })
    })
  })

  describe('weightBounds', () => {
    it('defaults to [1, 2] to match openskill.py', () => {
      expect.assertions(1)
      expect(constants({}).WEIGHT_BOUNDS).toStrictEqual([1, 2])
    })
    it('accepts a custom range', () => {
      expect.assertions(1)
      expect(constants({ weightBounds: [1, 5] }).WEIGHT_BOUNDS).toStrictEqual([1, 5])
    })
    it('accepts null to disable weight normalization', () => {
      expect.assertions(1)
      expect(constants({ weightBounds: null }).WEIGHT_BOUNDS).toBe(null)
    })
  })
})
