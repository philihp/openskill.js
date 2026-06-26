import { describe, it, expect } from '#test-helpers'
import { rate } from '..'
import bradleyTerryFull from '../models/bradley-terry-full'

// Parity with openskill.py 6.2.0's test_bradley_terry_full.py::test_rate, asserted against
// the exact constants from its fixture (tests/models/data/bradleyterryfull.json).
// Every player starts at the model's (mu, sigma), so a team is just a count of r.
// https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_full.py#L308-L392
//
// margins and (for the part models) 3+-team games are KNOWN DIVERGENCES from
// openskill.py 6.2.0, kept here with the upstream constants but skipped:
//   - margins: openskill.js scales the margin post-hoc in rate.ts; openskill.py
//     folds it into the model.
//   - part models on 3+ teams: openskill.js pairs adjacent teams (ladderPairs);
//     openskill.py rewrote them around a sliding window_size (default 4).

describe('BradleyTerryFull parity with openskill.py 6.2.0', () => {
  const r = { mu: 16.03354781649136, sigma: 12.429396412128556 }

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_full.py#L322-L326
  it('normal', () => {
    const result = rate([[r], [r, r]], { model: bradleyTerryFull })
    expect(result).toStrictEqual([
      [{ mu: 20.686574848684717, sigma: 12.190916868103495 }],
      [
        { mu: 11.380520784298003, sigma: 12.090638819927161 },
        { mu: 11.380520784298003, sigma: 12.090638819927161 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_full.py#L327-L336
  it('ranks', () => {
    const result = rate([[r], [r, r], [r], [r, r]], { model: bradleyTerryFull, rank: [2, 1, 4, 3] })
    expect(result).toStrictEqual([
      [{ mu: 22.58458782319289, sigma: 11.44990951618401 }],
      [
        { mu: 23.594511753367236, sigma: 11.47082891120956 },
        { mu: 23.594511753367236, sigma: 11.47082891120956 },
      ],
      [{ mu: 7.329544012760081, sigma: 11.44990951618401 }],
      [
        { mu: 10.625547676645233, sigma: 11.47082891120956 },
        { mu: 10.625547676645233, sigma: 11.47082891120956 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_full.py#L337-L342
  it('scores', () => {
    const result = rate([[r], [r, r]], { model: bradleyTerryFull, score: [1, 2] })
    expect(result).toStrictEqual([
      [{ mu: 13.764884206750324, sigma: 12.190916868103495 }],
      [
        { mu: 18.302211426232397, sigma: 12.090638819927161 },
        { mu: 18.302211426232397, sigma: 12.090638819927161 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_full.py#L343-L351
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
        model: bradleyTerryFull,
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
        { mu: 28.12809468606658, sigma: 11.37257601077789 },
        { mu: 40.2226415556418, sigma: 10.206572912959707 },
      ],
      [
        { mu: 22.08082125127897, sigma: 10.206572912959707 },
        { mu: 19.057184533885163, sigma: 11.37257601077789 },
      ],
      [
        { mu: 19.057184533885163, sigma: 11.37257601077789 },
        { mu: 22.08082125127897, sigma: 10.206572912959707 },
      ],
      [
        { mu: 13.009911099097556, sigma: 11.912857019523054 },
        { mu: 9.986274381703751, sigma: 11.37257601077789 },
      ],
      [
        { mu: 3.939000946916142, sigma: 11.37257601077789 },
        { mu: 9.986274381703751, sigma: 11.912857019523054 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_full.py#L352-L360
  it('limit_sigma', () => {
    const result = rate([[r], [r, r], [r, r, r]], { model: bradleyTerryFull, rank: [2, 1, 3], limitSigma: true })
    expect(result).toStrictEqual([
      [{ mu: 18.470824465419632, sigma: 12.064304058091345 }],
      [
        { mu: 21.768597131872525, sigma: 11.91450441624131 },
        { mu: 21.768597131872525, sigma: 11.91450441624131 },
      ],
      [
        { mu: 7.86122185218192, sigma: 11.999970481449761 },
        { mu: 7.86122185218192, sigma: 11.999970481449761 },
        { mu: 7.86122185218192, sigma: 11.999970481449761 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_full.py#L361-L368
  it('ties', () => {
    const result = rate([[r], [r, r], [r, r, r]], { model: bradleyTerryFull, rank: [1, 2, 1] })
    expect(result).toStrictEqual([
      [{ mu: 22.368878389960223, sigma: 12.064304058091345 }],
      [
        { mu: 9.40905558180175, sigma: 11.91450441624131 },
        { mu: 9.40905558180175, sigma: 11.91450441624131 },
      ],
      [
        { mu: 16.32270947771211, sigma: 11.999970481449761 },
        { mu: 16.32270947771211, sigma: 11.999970481449761 },
        { mu: 16.32270947771211, sigma: 11.999970481449761 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_full.py#L369-L381
  it('weights', () => {
    const result = rate(
      [
        [r, r, r],
        [r, r],
        [r, r, r],
        [r, r],
      ],
      {
        model: bradleyTerryFull,
        rank: [2, 1, 4, 3],
        weight: [
          [2, 0, 0],
          [1, 2],
          [0, 0, 1],
          [0, 1],
        ],
      }
    )
    expect(result).toStrictEqual([
      [
        { mu: 18.025653268906762, sigma: 11.187853119305666 },
        { mu: 17.02960054269906, sigma: 11.825077104049601 },
        { mu: 17.02960054269906, sigma: 11.825077104049601 },
      ],
      [
        { mu: 25.989955945165427, sigma: 11.821600475923185 },
        { mu: 35.9463640738395, sigma: 11.180502493645616 },
      ],
      [
        { mu: 6.609803175859515, sigma: 11.825077104049601 },
        { mu: 6.609803175859515, sigma: 11.825077104049601 },
        { mu: 11.321675496175438, sigma: 12.131143559677232 },
      ],
      [
        { mu: 14.504831602241435, sigma: 11.821600475923185 },
        { mu: 15.269189709366398, sigma: 12.129449233716796 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_full.py#L382-L389
  it('balance', () => {
    const result = rate(
      [
        [r, r],
        [r, r],
      ],
      { model: bradleyTerryFull, rank: [1, 2], balance: true }
    )
    expect(result).toStrictEqual([
      [
        { mu: 19.057184533885163, sigma: 12.174009240629777 },
        { mu: 19.057184533885163, sigma: 12.174009240629777 },
      ],
      [
        { mu: 13.009911099097556, sigma: 12.174009240629777 },
        { mu: 13.009911099097556, sigma: 12.174009240629777 },
      ],
    ])
  })

  describe('weight_bounds', () => {
    const d = { mu: 25, sigma: 25 / 3 }

    // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_full.py#L587-L592
    it('defaults to [1, 2]', () => {
      const teams = [
        [d, d, d],
        [d, d, d],
      ]
      const weight = [
        [0.5, 1, 2],
        [1, 1, 1],
      ]
      expect(rate(teams, { model: bradleyTerryFull, rank: [1, 2], weight })).toStrictEqual(
        rate(teams, { model: bradleyTerryFull, rank: [1, 2], weight, weightBounds: [1, 2] })
      )
    })

    // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_full.py#L595-L619
    it('narrower bounds shrink the within-team spread', () => {
      const teams = [
        [d, d, d],
        [d, d, d],
      ]
      const weight = [
        [0.5, 1, 2],
        [1, 1, 1],
      ]
      const wide = rate(teams, { model: bradleyTerryFull, rank: [1, 2], weight, weightBounds: [1, 2] })
      const narrow = rate(teams, { model: bradleyTerryFull, rank: [1, 2], weight, weightBounds: [0.9, 1.1] })
      expect(narrow[0][2].mu - narrow[0][0].mu).toBeLessThan(wide[0][2].mu - wide[0][0].mu)
    })

    // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_full.py#L622-L637
    it('weightBounds: null applies raw weights (uniform => equal updates)', () => {
      const result = rate(
        [
          [d, d, d],
          [d, d, d],
        ],
        {
          model: bradleyTerryFull,
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
