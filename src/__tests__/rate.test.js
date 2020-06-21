import { rate, rating } from '..'

describe('rate', () => {
  it('rate accepts and runs a placket-luce model by default', () => {
    const a1 = rating({ mu: 29.182, sigma: 4.782 })
    const b1 = rating({ mu: 27.174, sigma: 4.922 })
    const c1 = rating({ mu: 16.672, sigma: 6.217 })
    const d1 = rating()

    const [[a2], [b2], [c2], [d2]] = rate([[a1], [b1], [c1], [d1]])
    expect([[a2], [b2], [c2], [d2]]).toEqual([
      [{ mu: 30.209971908310553, sigma: 4.764898977359521 }],
      [{ mu: 27.64460833689499, sigma: 4.882789305097372 }],
      [{ mu: 17.403586731283518, sigma: 6.100723440599442 }],
      [{ mu: 19.214790707434826, sigma: 7.8542613981643985 }],
    ])
  })
})
