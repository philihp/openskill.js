import { describe, it, expect } from '#test-helpers'
import { rate } from '..'
import thurstoneMostellerFull from '../models/thurstone-mosteller-full'

// Parity with openskill.py 6.2.0's test_thurstone_mosteller_full.py::test_rate, asserted against
// the exact constants from its fixture (tests/models/data/thurstonemostellerfull.json).
// Every player starts at the model's (mu, sigma), so a team is just a count of r.
// https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_thurstone_mosteller_full.py#L315-L399
//
// margins and (for the part models) 3+-team games are KNOWN DIVERGENCES from
// openskill.py 6.2.0, kept here with the upstream constants but skipped:
//   - margins: openskill.js scales the margin post-hoc in rate.ts; openskill.py
//     folds it into the model.
//   - part models on 3+ teams: openskill.js pairs adjacent teams (ladderPairs);
//     openskill.py rewrote them around a sliding window_size (default 4).

describe('ThurstoneMostellerFull parity with openskill.py 6.2.0', () => {
  const r = { mu: 17.369819397619647, sigma: 5.379790119094205 }

  it('normal', () => {
    const result = rate([[r], [r, r]], { model: thurstoneMostellerFull })
    expect(result).toStrictEqual([
      [{ mu: 22.64925412780908, sigma: 5.105413295791267 }],
      [
        { mu: 12.090384667430214, sigma: 4.987055119379737 },
        { mu: 12.090384667430214, sigma: 4.987055119379737 },
      ],
    ])
  })

  it('ranks', () => {
    const result = rate([[r], [r, r], [r], [r, r]], { model: thurstoneMostellerFull, rank: [2, 1, 4, 3] })
    expect(result).toStrictEqual([
      [{ mu: 24.742920978542813, sigma: 4.703892673813669 }],
      [
        { mu: 19.91742257235955, sigma: 4.97447451720664 },
        { mu: 19.91742257235955, sigma: 4.97447451720664 },
      ],
      [{ mu: 14.297181388007196, sigma: 4.929870018015774 }],
      [
        { mu: 10.521752651569031, sigma: 4.654743459534082 },
        { mu: 10.521752651569031, sigma: 4.654743459534082 },
      ],
    ])
  })

  it('scores', () => {
    const result = rate([[r], [r, r]], { model: thurstoneMostellerFull, score: [1, 2] })
    expect(result).toStrictEqual([
      [{ mu: 17.04349567799341, sigma: 5.314344458972826 }],
      [
        { mu: 17.696143117245885, sigma: 5.2867266632571965 },
        { mu: 17.696143117245885, sigma: 5.2867266632571965 },
      ],
    ])
  })

  it.skip('margins [KNOWN DIVERGENCE: margin applied post-hoc in rate.ts vs in-model divisor]', () => {
    const result = rate(
      [
        [r, r],
        [r, r],
        [r, r],
        [r, r],
        [r, r],
      ],
      {
        model: thurstoneMostellerFull,
        score: [10, 5, 5, 2, 1],
        margin: 2,
        weight: [
          [1, 2],
          [2, 1],
          [1, 2],
          [3, 1],
          [1, 2],
        ],
      }
    )
    expect(result).toStrictEqual([
      [
        { mu: 24.949642339569337, sigma: 4.48677916139593 },
        { mu: 32.52946528151903, sigma: 3.3635231999089066 },
      ],
      [
        { mu: 21.159730868594494, sigma: 2.969185991040329 },
        { mu: 19.26477513310707, sigma: 4.345408589496402 },
      ],
      [
        { mu: 19.26477513310707, sigma: 4.345408589496402 },
        { mu: 21.159730868594494, sigma: 2.969185991040329 },
      ],
      [
        { mu: 15.474863662132224, sigma: 4.953800228768054 },
        { mu: 13.5799079266448, sigma: 4.48677916139593 },
      ],
      [
        { mu: 9.789996455669957, sigma: 4.48677916139593 },
        { mu: 13.579907926644802, sigma: 4.953800228768054 },
      ],
    ])
  })

  it('limit_sigma', () => {
    const result = rate([[r], [r, r], [r, r, r]], { model: thurstoneMostellerFull, rank: [2, 1, 3], limitSigma: true })
    expect(result[0][0].mu).toBeCloseTo(24.439837648240836, 10)
    expect(result[0][0].sigma).toBeCloseTo(5.097619302832102, 10)
    expect(result[1][0].mu).toBeCloseTo(21.52900161729248, 10)
    expect(result[1][0].sigma).toBeCloseTo(5.073466074339694, 10)
    expect(result[1][1].mu).toBeCloseTo(21.52900161729248, 10)
    expect(result[1][1].sigma).toBeCloseTo(5.073466074339694, 10)
    expect(result[2][0].mu).toBeCloseTo(6.140618927325626, 10)
    expect(result[2][0].sigma).toBeCloseTo(4.725957788249715, 10)
    expect(result[2][1].mu).toBeCloseTo(6.140618927325626, 10)
    expect(result[2][1].sigma).toBeCloseTo(4.725957788249715, 10)
    expect(result[2][2].mu).toBeCloseTo(6.140618927325626, 10)
    expect(result[2][2].sigma).toBeCloseTo(4.725957788249715, 10)
  })

  it('ties', () => {
    const result = rate([[r], [r, r], [r, r, r]], { model: thurstoneMostellerFull, rank: [1, 2, 1] })
    expect(result).toStrictEqual([
      [{ mu: 29.3305463246164, sigma: 4.860405772327232 }],
      [
        { mu: 11.673700042291802, sigma: 4.910478681463609 },
        { mu: 11.673700042291802, sigma: 4.910478681463609 },
      ],
      [
        { mu: 11.105211825950738, sigma: 4.877671631940031 },
        { mu: 11.105211825950738, sigma: 4.877671631940031 },
        { mu: 11.105211825950738, sigma: 4.877671631940031 },
      ],
    ])
  })

  it('weights', () => {
    const result = rate(
      [
        [r, r, r],
        [r, r],
        [r, r, r],
        [r, r],
      ],
      {
        model: thurstoneMostellerFull,
        rank: [2, 1, 4, 3],
        weight: [
          [2, 0, 0],
          [1, 2],
          [0, 0, 1],
          [0, 1],
        ],
      }
    )
    expect(result[0][0].mu).toBeCloseTo(16.466138095448585, 10)
    expect(result[0][0].sigma).toBeCloseTo(5.1287217832339795, 10)
    expect(result[0][1].mu).toBeCloseTo(15.562456793277523, 10)
    expect(result[0][1].sigma).toBeCloseTo(4.863999186851225, 10)
    expect(result[0][2].mu).toBeCloseTo(15.562456793277523, 10)
    expect(result[0][2].sigma).toBeCloseTo(4.863999186851225, 10)
    expect(result[1][0].mu).toBeCloseTo(26.930492133200257, 10)
    expect(result[1][0].sigma).toBeCloseTo(4.725015325817237, 10)
    expect(result[1][1].mu).toBeCloseTo(36.49116486878087, 10)
    expect(result[1][1].sigma).toBeCloseTo(3.9626321414518735, 10)
    expect(result[2][0].mu).toBeCloseTo(8.0952911269604, 10)
    expect(result[2][0].sigma).toBeCloseTo(4.6776882463763805, 10)
    expect(result[2][1].mu).toBeCloseTo(8.0952911269604, 10)
    expect(result[2][1].sigma).toBeCloseTo(4.6776882463763805, 10)
    expect(result[2][2].mu).toBeCloseTo(12.732555262290024, 10)
    expect(result[2][2].sigma).toBeCloseTo(5.041321924864341, 10)
    expect(result[3][0].mu).toBeCloseTo(18.891037537040408, 10)
    expect(result[3][0].sigma).toBeCloseTo(4.8761944947985265, 10)
    expect(result[3][1].mu).toBeCloseTo(20.412255676461168, 10)
    expect(result[3][1].sigma).toBeCloseTo(4.31340461031177, 10)
  })

  it('balance', () => {
    const result = rate(
      [
        [r, r],
        [r, r],
      ],
      { model: thurstoneMostellerFull, rank: [1, 2], balance: true }
    )
    expect(result).toStrictEqual([
      [
        { mu: 19.26477513310707, sigma: 5.171519258230143 },
        { mu: 19.26477513310707, sigma: 5.171519258230143 },
      ],
      [
        { mu: 15.474863662132224, sigma: 5.171519258230143 },
        { mu: 15.474863662132224, sigma: 5.171519258230143 },
      ],
    ])
  })

  describe('weight_bounds', () => {
    const d = { mu: 25, sigma: 25 / 3 }

    // test_weight_bounds_default: the default bounds are (1.0, 2.0).
    it('defaults to [1, 2]', () => {
      const teams = [
        [d, d, d],
        [d, d, d],
      ]
      const weight = [
        [0.5, 1, 2],
        [1, 1, 1],
      ]
      expect(rate(teams, { model: thurstoneMostellerFull, rank: [1, 2], weight })).toStrictEqual(
        rate(teams, { model: thurstoneMostellerFull, rank: [1, 2], weight, weightBounds: [1, 2] })
      )
    })

    // test_weight_bounds_custom: narrower bounds => smaller within-team spread.
    it('narrower bounds shrink the within-team spread', () => {
      const teams = [
        [d, d, d],
        [d, d, d],
      ]
      const weight = [
        [0.5, 1, 2],
        [1, 1, 1],
      ]
      const wide = rate(teams, { model: thurstoneMostellerFull, rank: [1, 2], weight, weightBounds: [1, 2] })
      const narrow = rate(teams, { model: thurstoneMostellerFull, rank: [1, 2], weight, weightBounds: [0.9, 1.1] })
      expect(narrow[0][2].mu - narrow[0][0].mu).toBeLessThan(wide[0][2].mu - wide[0][0].mu)
    })

    // test_weight_bounds_none_disables_normalization: uniform raw weights leave
    // every winner with the same mu change.
    it('weightBounds: null applies raw weights (uniform => equal updates)', () => {
      const result = rate(
        [
          [d, d, d],
          [d, d, d],
        ],
        {
          model: thurstoneMostellerFull,
          rank: [1, 2],
          weight: [
            [1, 1, 1],
            [1, 1, 1],
          ],
          weightBounds: null,
        }
      )
      expect(result[0][0].mu).toBeCloseTo(result[0][1].mu, 12)
      expect(result[0][1].mu).toBeCloseTo(result[0][2].mu, 12)
    })
  })
})

describe('ThurstoneMostellerFull single-match parity (openskill.py)', () => {
  it('matches Python for a single doubles match at default hyperparameters', () => {
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

  it('matches Python for a four-way free-for-all', () => {
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

  it('matches Python with ties in ranks', () => {
    const r = { mu: 25.0, sigma: 25 / 3 }
    const inputs = [[r], [r], [r], [r], [r]]
    const result = rate(inputs, { model: thurstoneMostellerFull, rank: [1, 2, 2, 4, 5] })
    expect(result).toStrictEqual([
      [{ mu: 41.92388609645312, sigma: 4.9590768827966 }],
      [{ mu: 29.23097152411328, sigma: 4.270482887179981 }],
      [{ mu: 29.23097152411328, sigma: 4.270482887179981 }],
      [{ mu: 16.53805695177344, sigma: 4.9590768827966 }],
      [{ mu: 8.076113903546883, sigma: 4.9590768827966 }],
    ])
  })
})
