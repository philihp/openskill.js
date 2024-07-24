import { rating, predictDraw } from '..'

describe('predictDraw', () => {
  const precision = 6

  const a1 = rating()
  const a2 = rating({ mu: 32.444, sigma: 1.123 })

  const b1 = rating({ mu: 35.881, sigma: 0.0001 })
  const b2 = rating({ mu: 25.188, sigma: 1.421 })

  const team1 = [a1, a2]
  const team2 = [b1, b2]

  it('if a tree falls in the forest', () => {
    expect.assertions(1)
    expect(predictDraw([])).toBeUndefined()
  })

  it('predicts 100% draw for solitaire', () => {
    expect.assertions(1)
    expect(predictDraw([team1])).toBeCloseTo(1, precision)
  })

  it('predicts 100% draw for self v self', () => {
    expect.assertions(1)
    expect(predictDraw([[b1], [b1]])).toBeCloseTo(1, precision)
  })

  it('predicts draw for two teams', () => {
    expect.assertions(1)
    expect(predictDraw([team1, team2])).toBeCloseTo(0.7802613510294426, precision)
  })

  it('predicts draw for three asymmetric teams', () => {
    expect.assertions(1)
    expect(predictDraw([team1, team2, [a1], [a2], [b1]])).toBeCloseTo(0.07517247728677093, precision)
  })

  it('mirrors results from python', () => {
    // from https://github.com/philihp/openskill.js/issues/599
    const t1 = [rating({ mu: 25, sigma: 1 }), rating({ mu: 25, sigma: 1 })]
    const t2 = [rating({ mu: 25, sigma: 1 }), rating({ mu: 25, sigma: 1 })]
    expect(predictDraw([t1, t2])).toBeCloseTo(0.6608263448857606)
  })

  it('gives a low probability in a 5 team match', () => {
    // from https://openskill.me/en/stable/manual.html
    const p1 = rating({ mu: 35, sigma: 1.0 })
    const p2 = rating({ mu: 35, sigma: 1.0 })
    const p3 = rating({ mu: 35, sigma: 1.0 })
    const p4 = rating({ mu: 35, sigma: 1.0 })
    const p5 = rating({ mu: 35, sigma: 1.0 })

    const team1 = [p1, p2]
    const team2 = [p3, p4, p5]
    expect(predictDraw([team1, team2])).toBeCloseTo(0.0002807397636509501, 10)
  })

  it('gives a higher probability with fewer players', () => {
    // from https://openskill.me/en/stable/manual.html
    const p1 = rating({ mu: 35, sigma: 1.0 })
    const p2 = rating({ mu: 35, sigma: 1.1 })
    const team1 = [p1]
    const team2 = [p2]
    expect(predictDraw([team1, team2])).toBeCloseTo(0.4868868769871696)
  })
})
