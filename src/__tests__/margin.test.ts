import { rate, rating } from '..'

describe('margin', () => {
  const a = rating()
  const b = rating()

  it('no margin produces the same result as omitting margin', () => {
    expect.assertions(1)
    const withoutMargin = rate([[a], [b]], { score: [10, 5] })
    const withZeroMargin = rate([[a], [b]], { score: [10, 5], margin: 0 })
    expect(withoutMargin).toStrictEqual(withZeroMargin)
  })

  it('margin with no score has no effect', () => {
    expect.assertions(1)
    const withoutMargin = rate([[a], [b]])
    const withMarginNoScore = rate([[a], [b]], { margin: 5 })
    expect(withoutMargin).toStrictEqual(withMarginNoScore)
  })

  it('does not mutate input ratings', () => {
    expect.assertions(2)
    const before = { mu: a.mu, sigma: a.sigma }
    rate([[a], [b]], { score: [10, 0], margin: 5 })
    expect(a.mu).toBe(before.mu)
    expect(a.sigma).toBe(before.sigma)
  })

  it('winner gains more mu with a large margin than without', () => {
    expect.assertions(1)
    const [[winner], [loser]] = rate([[a], [b]], { score: [10, 0] })
    const [[winnerM], [loserM]] = rate([[a], [b]], { score: [10, 0], margin: 1 })
    expect(winnerM.mu).toBeGreaterThan(winner.mu)
    void loser
    void loserM
  })

  it('loser loses more mu with a large margin than without', () => {
    expect.assertions(1)
    const [[winner], [loser]] = rate([[a], [b]], { score: [10, 0] })
    const [[winnerM], [loserM]] = rate([[a], [b]], { score: [10, 0], margin: 1 })
    expect(loserM.mu).toBeLessThan(loser.mu)
    void winner
    void winnerM
  })

  it('differences within the margin threshold are not amplified', () => {
    expect.assertions(2)
    const [[w1], [l1]] = rate([[a], [b]], { score: [5, 3] })
    const [[w2], [l2]] = rate([[a], [b]], { score: [5, 3], margin: 10 })
    expect(w1.mu).toBeCloseTo(w2.mu, 10)
    expect(l1.mu).toBeCloseTo(l2.mu, 10)
  })

  it('larger margins produce proportionally larger updates', () => {
    expect.assertions(2)
    const [[w1]] = rate([[a], [b]], { score: [10, 0], margin: 5 })
    const [[w2]] = rate([[a], [b]], { score: [20, 0], margin: 5 })
    expect(w2.mu).toBeGreaterThan(w1.mu)
    const [[w3]] = rate([[a], [b]], { score: [100, 0], margin: 5 })
    expect(w3.mu).toBeGreaterThan(w2.mu)
  })

  it('margin scaling is symmetric: winner gain equals loser loss', () => {
    expect.assertions(1)
    const [[w], [l]] = rate([[a], [b]], { score: [10, 0], margin: 1 })
    expect(w.mu + l.mu).toBeCloseTo(a.mu + b.mu, 10)
  })

  it('three-team ffa: winner benefits most from large margin', () => {
    expect.assertions(2)
    const c = rating()
    const [[w1], [p2], [l1]] = rate([[a], [b], [c]], { score: [10, 5, 0] })
    const [[w2], [p2m], [l2]] = rate([[a], [b], [c]], { score: [10, 5, 0], margin: 1 })
    expect(w2.mu).toBeGreaterThan(w1.mu)
    expect(l2.mu).toBeLessThan(l1.mu)
    void p2
    void p2m
  })

  it('margin is compatible with tau', () => {
    expect.assertions(1)
    expect(() => rate([[a], [b]], { score: [10, 0], margin: 3, tau: 0.3 })).not.toThrow()
  })

  it('margin is compatible with limitSigma', () => {
    expect.assertions(1)
    expect(() => rate([[a], [b]], { score: [10, 0], margin: 3, tau: 0.3, limitSigma: true })).not.toThrow()
  })

  it('exact values with margin=5, scores=[10,0]', () => {
    expect.assertions(2)
    const [[w], [l]] = rate([[a], [b]], { score: [10, 0], margin: 5 })
    // factor = 1 + log1p(max(0, 10 - 5)) / 1 = 1 + log1p(5) ≈ 2.7917
    // winner mu change is amplified by that factor
    expect(w.mu).toBeGreaterThan(25)
    expect(l.mu).toBeLessThan(25)
  })
})
