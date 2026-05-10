import { rate } from '..'
import thurstoneMostellerFull from '../models/thurstone-mosteller-full'
import thurstoneMostellerPart from '../models/thurstone-mosteller-part'

// Expected values produced by openskill==6.2.0 (Python).
// See /tmp/openskill-compare/tm_fixtures.py for the generator.
// CDF/PDF in src/statistics.ts mirror Python's NormalDist algorithm
// exactly, so single-match outputs are bit-for-bit identical.

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
        { mu: 29.624402539617087, sigma: 4.731811043331585 },
        { mu: 27.642677702936485, sigma: 4.867170032299351 },
      ],
      [
        { mu: 15.924336192468848, sigma: 6.046652169308378 },
        { mu: 23.65677880563643, sigma: 7.917461589002299 },
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
        { mu: 29.592226682338413, sigma: 4.773647674024611 },
        { mu: 27.60859085774696, sigma: 4.912805800182962 },
      ],
      [
        { mu: 15.97871364695718, sigma: 6.187298148722908 },
        { mu: 23.754471041944427, sigma: 8.260739733563808 },
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
      [{ mu: 32.52085123693871, sigma: 4.375950146467773 }],
      [{ mu: 27.506415974195786, sigma: 4.437501008136939 }],
      [{ mu: 19.021389842482407, sigma: 5.311185767439086 }],
      [{ mu: 9.689078200160441, sigma: 4.428266285854181 }],
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
      [{ mu: 41.92388609645312, sigma: 4.9590768827966 }],
      [{ mu: 29.23097152411328, sigma: 4.270482887179981 }],
      [{ mu: 29.23097152411328, sigma: 4.270482887179981 }],
      [{ mu: 16.53805695177344, sigma: 4.9590768827966 }],
      [{ mu: 8.076113903546883, sigma: 4.9590768827966 }],
    ])
  })
})
