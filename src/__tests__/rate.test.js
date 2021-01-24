import { rate, rating } from '..'

describe('rate', () => {
  const a1 = rating({ mu: 29.182, sigma: 4.782 })
  const b1 = rating({ mu: 27.174, sigma: 4.922 })
  const c1 = rating({ mu: 16.672, sigma: 6.217 })
  const d1 = rating()
  const e1 = rating()
  const f1 = rating()

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
    const [[a2], [b2], [c2], [d2]] = rate([[d1], [b1], [c1], [a1]], {
      rank: [4, 2, 3, 1],
    })
    expect([[a2], [b2], [c2], [d2]]).toStrictEqual([
      [{ mu: 30.209971908310553, sigma: 4.764898977359521 }],
      [{ mu: 27.64460833689499, sigma: 4.882789305097372 }],
      [{ mu: 17.403586731283518, sigma: 6.100723440599442 }],
      [{ mu: 19.214790707434826, sigma: 7.8542613981643985 }],
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
      { mu: 27.99071775460834, sigma: 4.901007097140011 },
      { mu: 17.60695098907354, sigma: 6.140737155130899 },
      { mu: 27.857928218465247, sigma: 4.743791738484319 },
      { mu: 27.341134074194173, sigma: 8.231039243636156 },
      { mu: 26.679827236407125, sigma: 8.148750467726549 },
      { mu: 20.979038689398703, sigma: 8.129445198549202 },
    ])
  })
})
