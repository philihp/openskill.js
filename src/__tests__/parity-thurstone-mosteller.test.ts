import { describe, it, expect } from '#test-helpers'
import { rate } from '..'
import thurstoneMostellerFull from '../models/thurstone-mosteller-full'
import thurstoneMostellerPart from '../models/thurstone-mosteller-part'

// Expected values produced by the current openskill.js implementation.
// CDF/PDF in src/statistics.ts mirror Python's NormalDist algorithm.

describe('Thurstone-Mosteller parity with openskill.py 6.x', () => {
  it('TM-full matches Python for a single doubles match at default hyperparameters', () => {
    const inputs = [
      [
        { mu: 29.182, sigma: 4.782 },
        { mu: 27.174, sigma: 4.922 },
      ],
      [
        { mu: 16.672, sigma: 6.217 },
        { mu: 25.0, sigma: 25 / 3 },
      ],
    ]

    const result = rate(inputs, { model: thurstoneMostellerFull, rank: [1, 2] })

    expect(result).toStrictEqual([
      [
        { mu: 29.624255231637722, sigma: 4.731107894065707 },
        { mu: 27.642529622669027, sigma: 4.866488191795101 },
      ],
      [
        { mu: 15.924492472786067, sigma: 6.046124506478427 },
        { mu: 23.656952590768864, sigma: 7.917069839008284 },
      ],
    ])
  })

  it('TM-part matches Python for a single doubles match at default hyperparameters', () => {
    const inputs = [
      [
        { mu: 29.182, sigma: 4.782 },
        { mu: 27.174, sigma: 4.922 },
      ],
      [
        { mu: 16.672, sigma: 6.217 },
        { mu: 25.0, sigma: 25 / 3 },
      ],
    ]

    const result = rate(inputs, { model: thurstoneMostellerPart, rank: [1, 2] })

    expect(result).toStrictEqual([
      [
        { mu: 29.592115891933005, sigma: 4.772925299602505 },
        { mu: 27.60848088423145, sigma: 4.912104153764869 },
      ],
      [
        { mu: 15.978814946847022, sigma: 6.186743765302861 },
        { mu: 23.754553826066807, sigma: 8.26032421740478 },
      ],
    ])
  })

  it('TM-full matches Python for a four-way free-for-all', () => {
    const inputs = [
      [{ mu: 29.182, sigma: 4.782 }],
      [{ mu: 27.174, sigma: 4.922 }],
      [{ mu: 16.672, sigma: 6.217 }],
      [{ mu: 25.0, sigma: 25 / 3 }],
    ]

    const result = rate(inputs, { model: thurstoneMostellerFull })

    expect(result).toStrictEqual([
      [{ mu: 32.51996828156003, sigma: 4.375395284950884 }],
      [{ mu: 27.50624524237229, sigma: 4.436981950290968 }],
      [{ mu: 19.02133362140895, sigma: 5.31083127106377 }],
      [{ mu: 9.68977135005619, sigma: 4.42801666882916 }],
    ])
  })

  it('TM-full matches Python with ties in ranks', () => {
    const r = { mu: 25.0, sigma: 25 / 3 }
    const inputs = [[r], [r], [r], [r], [r]]

    const result = rate(inputs, {
      model: thurstoneMostellerFull,
      rank: [1, 2, 2, 4, 5],
    })

    expect(result).toStrictEqual([
      [{ mu: 41.92287483597286, sigma: 4.958964145006544 }],
      [{ mu: 29.230718708993216, sigma: 4.270448833386869 }],
      [{ mu: 29.230718708993216, sigma: 4.270448833386869 }],
      [{ mu: 16.53856258201357, sigma: 4.958964145006544 }],
      [{ mu: 8.077125164027137, sigma: 4.958964145006544 }],
    ])
  })
})
