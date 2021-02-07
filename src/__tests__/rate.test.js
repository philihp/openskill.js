import { rate, rating } from '..'

describe('rate', () => {
  const a1 = rating({ mu: 29.182, sigma: 4.782 })
  const b1 = rating({ mu: 27.174, sigma: 4.922 })
  const c1 = rating({ mu: 16.672, sigma: 6.217 })
  const d1 = rating()
  const e1 = rating()
  const f1 = rating()
  const w1 = rating({ mu: 25 })
  const x1 = rating({ mu: 50 })
  const y1 = rating({ mu: 75 })
  const z1 = rating({ mu: 100 })

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

  it('accepts a rate ordering', () => {
    expect.assertions(1)
    const [[w2], [x2], [y2], [z2]] = rate([[w1], [x1], [y1], [z1]], {
      rank: [1, 3, 4, 2],
    })
    expect([w2, x2, y2, z2]).toStrictEqual([
      { mu: 28.67737565442646, sigma: 8.328456968941984 },
      { mu: 52.57392768912515, sigma: 8.235421539444559 },
      { mu: 70.58997703962795, sigma: 8.153023344882628 },
      { mu: 98.15871961682043, sigma: 8.191288071064596 },
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

  it('fixes orders of ties', () => {
    expect.assertions(1)
    const [[w2], [x2], [y2], [z2]] = rate([[w1], [x1], [y1], [z1]], {
      rank: [2, 4, 2, 1],
    })
    expect([w2, x2, y2, z2]).toStrictEqual([
      { mu: 26.62245966076562, sigma: 8.31025813361969 },
      { mu: 49.0783656590492, sigma: 8.25617415661398 },
      { mu: 73.3378484192217, sigma: 8.204569273806177 },
      { mu: 100.96132626096349, sigma: 8.261690241098727 },
    ])
  })

  it('runs a model when tied for first', () => {
    expect.assertions(1)
    const [[w2], [x2], [y2], [z2]] = rate([[e1], [e1], [e1], [e1]], {
      model: 'thurstonMostellerFull',
      score: [100, 84, 100, 72],
    })
    expect([w2, x2, y2, z2]).toStrictEqual([
      { mu: 33.41049241772118, sigma: 6.861184222487201 },
      { mu: 20.79475379113941, sigma: 5.99095578185474 },
      { mu: 33.41049241772118, sigma: 6.861184222487201 },
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
})
