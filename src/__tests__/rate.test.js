import { rate, rating } from '..'

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
      [{ mu: 30.209971908310553, sigma: 4.764898977359521 }],
      [{ mu: 27.64460833689499, sigma: 4.882789305097372 }],
      [{ mu: 17.403586731283518, sigma: 6.100723440599442 }],
      [{ mu: 19.214790707434826, sigma: 7.8542613981643985 }],
    ])
  })

  it('reverses rank', () => {
    expect.assertions(1)
    const [[loser], [winner]] = rate([[rating()], [rating()]], {
      rank: [2, 1],
    })
    expect([winner, loser]).toStrictEqual([
      { mu: 27.63523138347365, sigma: 8.065506316323548 },
      { mu: 22.36476861652635, sigma: 8.065506316323548 },
    ])
  })

  it('keeps rank', () => {
    expect.assertions(1)
    const [[loser], [winner]] = rate([[rating()], [rating()]], {
      rank: [1, 2],
    })
    expect([winner, loser]).toStrictEqual([
      { mu: 22.36476861652635, sigma: 8.065506316323548 },
      { mu: 27.63523138347365, sigma: 8.065506316323548 },
    ])
  })

  it('accepts a misordered rank ordering', () => {
    expect.assertions(1)
    const [[a], [b], [c], [d]] = rate([[d1], [d1], [d1], [d1]], {
      rank: [2, 1, 4, 3],
    })
    expect([a, b, c, d]).toStrictEqual([
      { mu: 26.552824984374855, sigma: 8.179213704945203 },
      { mu: 27.795084971874736, sigma: 8.263160757613477 },
      { mu: 20.96265504062538, sigma: 8.083731307186588 },
      { mu: 24.68943500312503, sigma: 8.083731307186588 },
    ])
  })

  it('accepts a rate ordering', () => {
    expect.assertions(1)
    const [[w2], [x2], [y2], [z2]] = rate([[w1], [x1], [y1], [z1]], {
      rank: [1, 3, 4, 2],
    })
    expect([w2, x2, y2, z2]).toStrictEqual([
      { mu: 18.13094482387197, sigma: 8.283124738447958 },
      { mu: 20.40517319790051, sigma: 8.107463101775272 },
      { mu: 20.65608164139383, sigma: 8.082178279446465 },
      { mu: 30.80780033683369, sigma: 8.154697408620104 },
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
      { mu: 27.857928218465247, sigma: 4.743791738484319 },
      { mu: 27.99071775460834, sigma: 4.901007097140011 },
      { mu: 17.60695098907354, sigma: 6.140737155130899 },
      { mu: 20.979038689398703, sigma: 8.129445198549202 },
      { mu: 27.341134074194173, sigma: 8.231039243636156 },
      { mu: 26.679827236407125, sigma: 8.148750467726549 },
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
      { mu: 11.942833056030613, sigma: 7.926463661123746 },
      { mu: 2.938193791485662, sigma: 9.65347573412201 },
      { mu: -1.4023734358082325, sigma: 11.323360667700934 },
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
    const [[a], [b], [c], [d]] = rate(
      [[rating()], [rating()], [rating()], [rating()]],
      {
        rank: [1, 1, 1, 1],
      }
    )
    expect([a, b, c, d]).toStrictEqual([
      { mu: 25, sigma: 8.263160757613477 },
      { mu: 25, sigma: 8.263160757613477 },
      { mu: 25, sigma: 8.263160757613477 },
      { mu: 25, sigma: 8.263160757613477 },
    ])
  })

  it('fixes orders of ties', () => {
    expect.assertions(1)
    const [[w2], [x2], [y2], [z2]] = rate([[w1], [x1], [y1], [z1]], {
      rank: [2, 4, 2, 1],
    })
    expect([w2, x2, y2, z2]).toStrictEqual([
      { mu: 15.340046366255285, sigma: 8.21273604193863 },
      { mu: 18.007807436399276, sigma: 8.188629384105589 },
      { mu: 24.25804790911316, sigma: 8.166514496319483 },
      { mu: 32.39409828823228, sigma: 8.247276990243211 },
    ])
  })

  it('runs a model whith ties for first', () => {
    expect.assertions(1)
    const [[w2], [x2], [y2], [z2]] = rate([[e1], [e1], [e1], [e1]], {
      model: 'thurstoneMostellerFull',
      score: [100, 84, 100, 72],
    })
    expect([w2, x2, y2, z2]).toStrictEqual([
      { mu: 33.41053241772118, sigma: 5.4240467327131805 },
      { mu: 20.79475379113941, sigma: 5.99095578185474 },
      { mu: 33.41053241772118, sigma: 5.4240467327131805 },
      { mu: 12.38426137341823, sigma: 5.99095578185474 },
    ])
  })

  it('accepts a score instead of rank', () => {
    expect.assertions(1)
    const [[x2], [y2], [z2]] = rate([[e1], [e1], [e1]], {
      score: [1, 1, 1],
    })
    expect([x2, y2, z2]).toStrictEqual([
      { mu: 25, sigma: 8.204837030780652 },
      { mu: 25, sigma: 8.204837030780652 },
      { mu: 25, sigma: 8.204837030780652 },
    ])
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
      preventSigmaIncrease: true,
    })

    expect([winner, loser]).toStrictEqual([
      { mu: 40.00032667136128, sigma: 3 },
      { mu: -20.000326671361275, sigma: 3 },
    ])
  })
})
