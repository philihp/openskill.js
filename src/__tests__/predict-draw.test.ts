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

  // it('test_predict_draw from openskill.py', () => {
  //   expect.assertions(3)
  //   const a1 = rating()
  //   const a2 = rating({ mu: 32.444, sigma: 1.123 })
  //   const b1 = rating({ mu: 35.881, sigma: 0.0001 })
  //   const b2 = rating({ mu: 25.188, sigma: 0.00001 })
  //   const team_1 = [a1, a2]
  //   const team_2 = [b1, b2]
  //   const p1 = predictDraw([team_1, team_2])
  //   expect(p1).toBeCloseTo(0.1694772)
  //   const p2 = predictDraw([team_1, team_2, [a1], [a2], [b1]])
  //   expect(p2).toBeCloseTo(0.0518253)
  //   const p3 = predictDraw([[b1], [b1]])
  //   expect(p3).toBe(0.5)
  // })
})
