import { describe, it, expect } from '#test-helpers'
import { rate, rating } from '..'
import thurstoneMostellerFull from '../models/thurstone-mosteller-full'

describe('rate', () => {
  const a1 = rating({ mu: 29.182, sigma: 4.782 })
  const b1 = rating({ mu: 27.174, sigma: 4.922 })
  const c1 = rating({ mu: 16.672, sigma: 6.217 })
  const d1 = rating()
  const e1 = rating()
  const f1 = rating()
  const w1 = rating({ mu: 15, sigma: 25 / 3.0 })
  const x1 = rating({ mu: 20, sigma: 25 / 3.0 })
  const y1 = rating({ mu: 25, sigma: 25 / 3.0 })
  const z1 = rating({ mu: 30, sigma: 25 / 3.0 })

  it('rate accepts and runs a placket-luce model by default', () => {
    expect.assertions(1)
    const [[a2], [b2], [c2], [d2]] = rate([[a1], [b1], [c1], [d1]])
    expect([[a2], [b2], [c2], [d2]]).toStrictEqual([
      [{ mu: 30.210227447000438, sigma: 4.765617924939384 }],
      [{ mu: 27.644725221915632, sigma: 4.883479590134575 }],
      [{ mu: 17.4036218889969, sigma: 6.101259408259549 }],
      [{ mu: 19.21460876538932, sigma: 7.854669920480409 }],
    ])
  })

  it('rate accepts and runs a placket-luce model with tau', () => {
    expect.assertions(1)
    const a1 = rating({ mu: 29.182, sigma: 4.782 })
    const b1 = rating({ mu: 27.174, sigma: 4.922 })
    const c1 = rating({ mu: 16.672, sigma: 6.217 })
    const d1 = rating()

    const [[a2], [b2], [c2], [d2]] = rate([[a1], [b1], [c1], [d1]], { tau: 0.01 })

    expect([[a2], [b2], [c2], [d2]]).toStrictEqual([
      [{ mu: 30.20997558824299, sigma: 4.764909330988368 }],
      [{ mu: 27.64461002009721, sigma: 4.882799245921361 }],
      [{ mu: 17.403587237635527, sigma: 6.100731158882956 }],
      [{ mu: 19.21478808745494, sigma: 7.854267281042293 }],
    ])
  })

  it('rate accepts and runs a placket-luce model with tau and limitSigma', () => {
    expect.assertions(2)
    const a1 = rating({ mu: 6.672, sigma: 0.0001 })
    const b1 = rating({ mu: 29.182, sigma: 4.782 })

    const [[a2], [b2]] = rate([[a1], [b1]], { tau: 0.01, limitSigma: true })

    expect(a2.sigma).toBeLessThanOrEqual(a1.sigma)
    expect([[a2], [b2]]).toStrictEqual([
      [{ mu: 6.672012533190158, sigma: 0.0001 }],
      [{ mu: 26.316243774876106, sigma: 4.7540633621019 }],
    ])
  })

  it('rate accepts and runs a placket-luce model by default for teams', () => {
    const a1 = rating({ mu: 29.182, sigma: 4.782 })
    const b1 = rating({ mu: 27.174, sigma: 4.922 })
    const c1 = rating({ mu: 16.672, sigma: 6.217 })
    const d1 = rating()

    const [[a2, b2], [c2, d2]] = rate([
      [a1, b1],
      [c1, d1],
    ])

    expect([a2, b2, c2, d2]).toStrictEqual([
      { mu: 29.607340941337068, sigma: 4.755311788972862 },
      { mu: 27.624602782532037, sigma: 4.892807828777459 },
      { mu: 15.953170429143093, sigma: 6.125902065139878 },
      { mu: 23.70858117648013, sigma: 8.111707446126035 },
    ])
  })

  it('rate accepts and runs a placket-luce model by default for teams with tau', () => {
    const a1 = rating({ mu: 29.182, sigma: 4.782 })
    const b1 = rating({ mu: 27.174, sigma: 4.922 })
    const c1 = rating({ mu: 16.672, sigma: 6.217 })
    const d1 = rating()

    const [[a2, b2], [c2, d2]] = rate(
      [
        [a1, b1],
        [c1, d1],
      ],
      { tau: 0.01 }
    )

    expect([a2, b2, c2, d2]).toStrictEqual([
      { mu: 29.60722003260825, sigma: 4.754607604502581 },
      { mu: 27.624482251695827, sigma: 4.892124276331747 },
      { mu: 15.953286947567106, sigma: 6.1253654293947335 },
      { mu: 23.708689129525133, sigma: 8.111303923213725 },
    ])
  })

  it('rate accepts and runs a placket-luce model by default for teams with tau and limitSigma', () => {
    const a1 = rating({ mu: 9.182, sigma: 0.0001 })
    const b1 = rating({ mu: 27.174, sigma: 4.922 })
    const c1 = rating({ mu: 16.672, sigma: 6.217 })
    const d1 = rating()

    const [[a2, b2], [c2, d2]] = rate(
      [
        [a1, b1],
        [c1, d1],
      ],
      { tau: 0.01, limitSigma: true }
    )

    expect(a2.sigma).toBeLessThanOrEqual(a1.sigma)

    expect([a2, b2, c2, d2]).toStrictEqual([
      { mu: 9.182004653636957, sigma: 0.0001 },
      { mu: 28.301285923165363, sigma: 4.889318394468611 },
      { mu: 14.87349383521136, sigma: 6.076727029758966 },
      { mu: 21.768626152890867, sigma: 7.992333183226455 },
    ])
  })

  it('reverses rank', () => {
    expect.assertions(1)
    const [[loser], [winner]] = rate([[rating()], [rating()]], {
      rank: [2, 1],
    })
    expect([winner, loser]).toStrictEqual([
      { mu: 27.635389493140497, sigma: 8.06590141354368 },
      { mu: 22.364610506859503, sigma: 8.06590141354368 },
    ])
  })

  it('keeps rank', () => {
    expect.assertions(1)
    const [[loser], [winner]] = rate([[rating()], [rating()]], {
      rank: [1, 2],
    })
    expect([winner, loser]).toStrictEqual([
      { mu: 22.364610506859503, sigma: 8.06590141354368 },
      { mu: 27.635389493140497, sigma: 8.06590141354368 },
    ])
  })

  it('accepts a misordered rank ordering', () => {
    expect.assertions(1)
    const [[a], [b], [c], [d]] = rate([[d1], [d1], [d1], [d1]], {
      rank: [2, 1, 4, 3],
    })
    expect([a, b, c, d]).toStrictEqual([
      { mu: 26.55291815138952, sigma: 8.17961798837266 },
      { mu: 27.795252672501135, sigma: 8.263571791259416 },
      { mu: 20.962412806387245, sigma: 8.084127880168786 },
      { mu: 24.689416369722096, sigma: 8.084127880168786 },
    ])
  })

  it('accepts a rate ordering', () => {
    expect.assertions(1)
    const [[w2], [x2], [y2], [z2]] = rate([[w1], [x1], [y1], [z1]], {
      rank: [1, 3, 4, 2],
    })
    expect([w2, x2, y2, z2]).toStrictEqual([
      { mu: 18.131120980297805, sigma: 8.283536573151807 },
      { mu: 20.405169039419135, sigma: 8.107860440531121 },
      { mu: 20.65583040714804, sigma: 8.082574596348321 },
      { mu: 30.80787957313502, sigma: 8.155100416275928 },
    ])
  })

  it('accepts teams in rating order', () => {
    expect.assertions(1)
    const [[a2, d2], [b2, e2], [c2, f2]] = rate(
      [
        [a1, d1],
        [b1, e1],
        [c1, f1],
      ],
      {
        rank: [3, 1, 2],
      }
    )
    expect([a2, b2, c2, d2, e2, f2]).toStrictEqual([
      { mu: 27.857622571955794, sigma: 4.744504197327133 },
      { mu: 27.990904891666695, sigma: 4.901705733959291 },
      { mu: 17.607030910762578, sigma: 6.141282638892306 },
      { mu: 20.97892943330433, sigma: 8.129851804000902 },
      { mu: 27.341233554297506, sigma: 8.2314516336455 },
      { mu: 26.67983701239816, sigma: 8.149157818911323 },
    ])
  })

  it('allows ties', () => {
    expect.assertions(1)
    const a = rating({ mu: 10, sigma: 8 })
    const b = rating({ mu: 5, sigma: 10 })
    const c = rating({ mu: 0, sigma: 12 })
    const [[x], [y], [z]] = rate([[a], [b], [c]], {
      rank: [1, 2, 2],
    })
    expect([x, y, z]).toStrictEqual([
      { mu: 11.942996666741225, sigma: 7.926888197620324 },
      { mu: 2.9381178546315034, sigma: 9.653804487570165 },
      { mu: -1.4024317012198733, sigma: 11.323641575516767 },
    ])
  })

  it('allows ties with reorder', () => {
    expect.assertions(1)
    const a = rating({ mu: 10, sigma: 8 })
    const b = rating({ mu: 5, sigma: 10 })
    const c = rating({ mu: 0, sigma: 12 })
    const [[y3], [z3], [x3]] = rate([[b], [c], [a]], {
      rank: [2, 2, 1],
    })
    const [[x2], [y2], [z2]] = rate([[a], [b], [c]], {
      rank: [1, 2, 2],
    })
    expect([x2, y2, z2]).toStrictEqual([x3, y3, z3])
  })

  it('four-way-tie with newbies', () => {
    expect.assertions(1)
    const [[a], [b], [c], [d]] = rate([[rating()], [rating()], [rating()], [rating()]], {
      rank: [1, 1, 1, 1],
    })
    expect([a, b, c, d]).toStrictEqual([
      { mu: 25, sigma: 8.263571791259416 },
      { mu: 25, sigma: 8.263571791259416 },
      { mu: 25, sigma: 8.263571791259416 },
      { mu: 25, sigma: 8.263571791259416 },
    ])
  })

  it('treats equal zero ranks as a draw (1v1)', () => {
    expect.assertions(1)
    const [[a], [b]] = rate([[rating()], [rating()]], {
      rank: [0, 0],
    })
    expect([a, b]).toStrictEqual([
      { mu: 25, sigma: 8.06590141354368 },
      { mu: 25, sigma: 8.06590141354368 },
    ])
  })

  it('treats equal zero scores as a draw (1v1)', () => {
    expect.assertions(1)
    const [[a], [b]] = rate([[rating()], [rating()]], {
      score: [0, 0],
    })
    expect([a, b]).toStrictEqual([
      { mu: 25, sigma: 8.06590141354368 },
      { mu: 25, sigma: 8.06590141354368 },
    ])
  })

  it('fixes orders of ties', () => {
    expect.assertions(1)
    const [[w2], [x2], [y2], [z2]] = rate([[w1], [x1], [y1], [z1]], {
      rank: [2, 4, 2, 1],
    })
    expect([w2, x2, y2, z2]).toStrictEqual([
      { mu: 15.340043358359136, sigma: 8.213141619804967 },
      { mu: 18.007678675484204, sigma: 8.189033933813437 },
      { mu: 24.25801928251219, sigma: 8.166918055585525 },
      { mu: 32.39425868364447, sigma: 8.247687230833794 },
    ])
  })

  it('runs a model with ties for first', () => {
    expect.assertions(1)
    const [[w2], [x2], [y2], [z2]] = rate([[e1], [e1], [e1], [e1]], {
      model: thurstoneMostellerFull,
      score: [100, 84, 100, 72],
    })
    expect([w2, x2, y2, z2]).toStrictEqual([
      { mu: 33.46194304822656, sigma: 5.426947616252378 },
      { mu: 20.76902847588672, sigma: 5.9839100819896975 },
      { mu: 33.46194304822656, sigma: 5.426947616252378 },
      { mu: 12.307085427660162, sigma: 5.9839100819896975 },
    ])
  })

  it('accepts a score instead of rank', () => {
    expect.assertions(1)
    const [[x2], [y2], [z2]] = rate([[e1], [e1], [e1]], {
      score: [1, 1, 1],
    })
    expect([x2, y2, z2]).toStrictEqual([
      { mu: 25, sigma: 8.205243377397993 },
      { mu: 25, sigma: 8.205243377397993 },
      { mu: 25, sigma: 8.205243377397993 },
    ])
  })

  it('applies weights for partial play', () => {
    expect.assertions(1)
    // Weights scale each player's update by their relative contribution to the
    // team; by default they are normalized per-team into [1, 2]. This locks
    // openskill.js's own output for a weighted 2v2 — it is NOT a replication of a
    // Python test. The Python test_rate weights case (4 teams of 3/2/3/2) is
    // replicated in parity-plackett-luce.test.ts.
    const result = rate(
      [
        [a1, b1],
        [c1, d1],
      ],
      {
        weight: [
          [0.9, 1],
          [1, 0.6],
        ],
      }
    )
    expect(result).toStrictEqual([
      [
        { mu: 29.607340941337068, sigma: 4.755311788972862 },
        { mu: 28.075205565064074, sigma: 4.86272644246492 },
      ],
      [
        { mu: 16.31258521457155, sigma: 6.171900418676952 },
        { mu: 23.70858117648013, sigma: 8.111707446126035 },
      ],
    ])
  })

  it('normalizes uniform within-team weights to a no-op', () => {
    expect.assertions(1)
    // When every player on a team shares the same weight there is no relative
    // difference to preserve, so per-team normalization collapses them to 1 and
    // the result is identical to passing no weights at all.
    const teams = [
      [rating(), rating()],
      [rating(), rating()],
    ] as const
    const weighted = rate(teams, {
      weight: [
        [0.83, 0.83],
        [1, 1],
      ],
    })
    expect(weighted).toStrictEqual(rate(teams))
  })

  it('applies raw weights when normalization is disabled with weightBounds: null', () => {
    expect.assertions(2)
    // The 6v5 partial-play case from issue #1018: each player on the larger team
    // sits out 1/6 of the time, so weighting them all at 5/6 damps their update.
    // This only takes effect with normalization disabled. openskill.js behavior
    // test (2v2), not a replication of a Python test.
    const teams = [
      [rating(), rating()],
      [rating(), rating()],
    ] as const
    const result = rate(teams, {
      weightBounds: null,
      weight: [
        [5 / 6, 5 / 6],
        [1, 1],
      ],
    })
    const baseline = rate(teams)
    // The winning team's mu still rises, but by less than an unweighted win.
    expect(result[0][0].mu).toBeLessThan(baseline[0][0].mu)
    expect(result[0][0].mu).toBeGreaterThan(25)
  })

  it('accepts a tau term', () => {
    expect.assertions(1)
    const a = rating({ mu: 25, sigma: 3 })
    const b = rating({ mu: 25, sigma: 3 })
    const [[winner], [loser]] = rate([[a], [b]], {
      tau: 0.3,
    })

    expect([winner, loser]).toStrictEqual([
      { mu: 25.624880438870754, sigma: 2.9879993738476953 },
      { mu: 24.375119561129246, sigma: 2.9879993738476953 },
    ])
  })

  it('prevents sigma from rising', () => {
    expect.assertions(1)
    const a = rating({ mu: 40, sigma: 3 })
    const b = rating({ mu: -20, sigma: 3 })
    const [[winner], [loser]] = rate([[a], [b]], {
      tau: 0.3,
      limitSigma: true,
    })

    expect([winner, loser]).toStrictEqual([
      { mu: 40.00032667136128, sigma: 3 },
      { mu: -20.000326671361275, sigma: 3 },
    ])
  })
})
