import { winProbability, rate, rating } from '..'

describe('winProbability', () => {
  it('beep bop', () => {
    expect.assertions(1)
    expect(false).toBe(false)
  })

  it('qualifies an even 1 v 1 match', () => {
    expect.assertions(1)
    expect(winProbability([[rating()], [rating()]])).toBeCloseTo(1 / 2)
  })

  it('qualifies an even 5 v 5 match', () => {
    expect.assertions(4)
    const redTeam0 = new Array(5).fill(rating())
    const blueTeam0 = new Array(5).fill(rating())
    expect(winProbability([redTeam0, blueTeam0])).toBeCloseTo(0.5)

    const [redTeam1, blueTeam1] = rate([redTeam0, blueTeam0])
    expect(winProbability([redTeam1, blueTeam1])).toBeCloseTo(0.6698)

    const [redTeam2, blueTeam2] = rate([redTeam1, blueTeam1])
    expect(winProbability([redTeam2, blueTeam2])).toBeCloseTo(0.7815)

    const [redTeam3, blueTeam3] = rate([redTeam2, blueTeam2], { rank: [2, 1] })
    expect(winProbability([redTeam3, blueTeam3])).toBeCloseTo(0.5671)
  })

  it('gives ratings on asymmetric teams', () => {
    expect.assertions(5)
    const a0 = rating()
    const b0 = rating()
    const c0 = rating()
    const d0 = rating()
    const e0 = rating()

    const [[a1, b1, c1], [d1, e1]] = rate([
      [a0, b0, c0],
      [d0, e0],
    ])

    const [[a2, b2], [c2, d2, e2]] = rate([
      [a1, b1],
      [c1, d1, e1],
    ])

    expect(winProbability([[a2], [b2]])).toBeCloseTo(0.5)
    expect(winProbability([[b2], [c2]])).toBeCloseTo(0.6604)
    expect(winProbability([[c2], [d2]])).toBeCloseTo(0.5479)
    expect(winProbability([[d2], [e2]])).toBeCloseTo(0.5)
    expect(
      winProbability([
        [a2, d2],
        [b2, c2],
      ])
    ).toBeCloseTo(0.4661)
  })
})
