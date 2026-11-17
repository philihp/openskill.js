import { describe, it, expect } from '#test-helpers'
import { rate, rating } from '..'
import * as models from '../models'

describe('margin', () => {
  const a = rating()
  const b = rating()
  const favorite = rating({ mu: 30 })
  const underdog = rating({ mu: 20 })

  it('no margin produces the same result as omitting margin', () => {
    expect.assertions(1)
    const withoutMargin = rate([[favorite], [underdog]], { score: [10, 5] })
    const withZeroMargin = rate([[favorite], [underdog]], { score: [10, 5], margin: 0 })
    expect(withoutMargin).toStrictEqual(withZeroMargin)
  })

  it('margin with no score has no effect', () => {
    expect.assertions(1)
    const withoutMargin = rate([[favorite], [underdog]])
    const withMarginNoScore = rate([[favorite], [underdog]], { margin: 5 })
    expect(withoutMargin).toStrictEqual(withMarginNoScore)
  })

  it('does not mutate input ratings', () => {
    expect.assertions(2)
    const before = { mu: favorite.mu, sigma: favorite.sigma }
    rate([[favorite], [underdog]], { score: [10, 0], margin: 5 })
    expect(favorite.mu).toBe(before.mu)
    expect(favorite.sigma).toBe(before.sigma)
  })

  Object.entries(models).forEach(([name, model]) => {
    describe(name, () => {
      it('has no effect when the teams have the same mu', () => {
        expect.assertions(1)
        const withoutMargin = rate([[a], [b]], { model, score: [10, 0] })
        const withMargin = rate([[a], [b]], { model, score: [10, 0], margin: 2 })
        expect(withMargin).toStrictEqual(withoutMargin)
      })

      it('has no effect when the score difference is within the margin', () => {
        expect.assertions(1)
        const withoutMargin = rate([[favorite], [underdog]], { model, score: [5, 3] })
        const withMargin = rate([[favorite], [underdog]], { model, score: [5, 3], margin: 10 })
        expect(withMargin).toStrictEqual(withoutMargin)
      })

      it('gives a favorite who wins by a large difference more mu', () => {
        expect.assertions(1)
        // log1p(10 / 2) is more than 1, so the gap in mu looks smaller
        const [[plain]] = rate([[favorite], [underdog]], { model, score: [10, 0] })
        const [[blowout]] = rate([[favorite], [underdog]], { model, score: [10, 0], margin: 2 })
        expect(blowout.mu).toBeGreaterThan(plain.mu)
      })

      it('gives an underdog who wins by a large difference less mu', () => {
        expect.assertions(1)
        const [[plain]] = rate([[underdog], [favorite]], { model, score: [10, 0] })
        const [[blowout]] = rate([[underdog], [favorite]], { model, score: [10, 0], margin: 2 })
        expect(blowout.mu).toBeLessThan(plain.mu)
      })

      it('keeps each score with its team when the teams are not in rank order', () => {
        expect.assertions(1)
        const [[f1], [u1]] = rate([[favorite], [underdog]], { model, score: [10, 0], margin: 2 })
        const [[u2], [f2]] = rate([[underdog], [favorite]], { model, score: [0, 10], margin: 2 })
        expect([f2, u2]).toStrictEqual([f1, u1])
      })
    })
  })

  it('margin is compatible with tau', () => {
    expect.assertions(1)
    expect(() => rate([[favorite], [underdog]], { score: [10, 0], margin: 3, tau: 0.3 })).not.toThrow()
  })

  it('margin is compatible with limitSigma', () => {
    expect.assertions(1)
    expect(() =>
      rate([[favorite], [underdog]], { score: [10, 0], margin: 3, tau: 0.3, limitSigma: true })
    ).not.toThrow()
  })
})
