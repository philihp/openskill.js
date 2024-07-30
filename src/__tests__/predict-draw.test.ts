import { rating, predictDraw } from '..'

describe('predictDraw', () => {
  it('if a tree falls in the forest', () => {
    expect(predictDraw([])).toBe(1)
  })

  it('mirrors results from python', () => {
    // from https://github.com/philihp/openskill.js/issues/599
    const t1 = [rating({ mu: 25, sigma: 1 }), rating({ mu: 25, sigma: 1 })]
    const t2 = [rating({ mu: 25, sigma: 1 }), rating({ mu: 25, sigma: 1 })]
    expect(predictDraw([t1, t2])).toBe(0.2433180271619435)
  })

  // we use toBeCloseTo because of differences between the gaussian library we use in js and
  // the statistics.NormalDist impl in py, so the conditioning of the answer is only equivalent
  // to a certain degree of precision.
  //
  // This is known and accepted.

  it('gives a low probability in a 5 team match', () => {
    // from https://openskill.me/en/stable/manual.html
    const p1 = rating({ mu: 35, sigma: 1.0 })
    const p2 = rating({ mu: 35, sigma: 1.0 })
    const p3 = rating({ mu: 35, sigma: 1.0 })
    const p4 = rating({ mu: 35, sigma: 1.0 })
    const p5 = rating({ mu: 35, sigma: 1.0 })

    const team1 = [p1, p2]
    const team2 = [p3, p4, p5]
    expect(predictDraw([team1, team2])).toBeCloseTo(0.0002807397636509501, 9)
  })

  it('gives a higher probability with fewer players', () => {
    // from https://openskill.me/en/stable/manual.html
    const p1 = rating({ mu: 35, sigma: 1.0 })
    const p2 = rating({ mu: 35, sigma: 1.1 })
    const team1 = [p1]
    const team2 = [p2]
    expect(predictDraw([team1, team2])).toBeCloseTo(0.4868868769871696, 8)
  })

  it('returns NaN when one team of nobody', () => {
    // this could be undefined, but i think that makes more work for people to guard against that response,
    // while a NaN tends to passed along without halting.
    expect(predictDraw([[]])).toBe(Number.NaN)
  })

  it('returns one when two teams of nobody', () => {
    expect(predictDraw([[], []])).toBe(Number.NaN)
  })

  it('returns NaN when only one team', () => {
    const p1 = rating({ mu: 23.096623784758727, sigma: 8.138233582011868 })
    const p2 = rating({ mu: 28.450555874288018, sigma: 8.156810439252277 })
    expect(predictDraw([[p1, p2]])).toBe(Number.NaN)
  })

  it('returns 1 when one team verses an empty team', () => {
    const p2 = rating({ mu: 28.450555874288018, sigma: 8.156810439252277 })
    expect(predictDraw([[p2], []])).toBe(1)
  })

  describe('two game, 2v2 scenario with 5th defector', () => {
    // these ratings come directly from python, where all players start out with baseline mu=25, sigma=25/3, then we do
    // [[a,b,c], [d,e]] = rate([[a,b,c], [d,e]])
    // [[a,b], [c,d,e]] = rate([[a,b], [c,d,e]])
    const [a, b, c, d, _e] = [
      rating({ mu: 28.450555874288018, sigma: 8.156810439252277 }),
      rating({ mu: 28.450555874288018, sigma: 8.156810439252277 }),
      rating({ mu: 23.096623784758727, sigma: 8.138233582011868 }),
      rating({ mu: 21.537948364040137, sigma: 8.155255551436932 }),
      rating({ mu: 21.537948364040137, sigma: 8.155255551436932 }),
    ]

    it('is a likely draw with the 5th sitting out', () => {
      expect(
        predictDraw([
          [a, b],
          [c, d],
        ])
      ).toBeCloseTo(0.09227283302635064, 7)
    })

    it('has draw probabilities with hypothetical mashups', () => {
      expect(
        predictDraw([
          [a, c],
          [b, d],
        ])
      ).toBeCloseTo(0.11489223845523855, 7)
    })
  })
})
