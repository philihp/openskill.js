import { describe, it, expect } from '#test-helpers'
import { rate } from '..'
import plackettLuce from '../models/plackett-luce'

// Parity with openskill.py 6.2.0's test_plackett_luce.py::test_rate, asserted against
// the exact constants from its fixture (tests/models/data/plackettluce.json).
// Every player starts at the model's (mu, sigma), so a team is just a count of r.
// https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L304-L388
//
// margins and (for the part models) 3+-team games are KNOWN DIVERGENCES from
// openskill.py 6.2.0, kept here with the upstream constants but skipped:
//   - margins: openskill.js scales the margin post-hoc in rate.ts; openskill.py
//     folds it into the model.
//   - part models on 3+ teams: openskill.js pairs adjacent teams (ladderPairs);
//     openskill.py rewrote them around a sliding window_size (default 4).

describe('PlackettLuce parity with openskill.py 6.2.0', () => {
  const r = { mu: 20.35125162611535, sigma: 8.33148112355601 }

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L319-L323
  it('normal', () => {
    const result = rate([[r], [r, r]], { model: plackettLuce })
    expect(result).toStrictEqual([
      [{ mu: 23.855123082692877, sigma: 8.22447878583752 }],
      [
        { mu: 16.84738016953782, sigma: 8.179571171464575 },
        { mu: 16.84738016953782, sigma: 8.179571171464575 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L324-L333
  it('ranks', () => {
    const result = rate([[r], [r, r], [r], [r, r]], { model: plackettLuce, rank: [2, 1, 4, 3] })
    expect(result).toStrictEqual([
      [{ mu: 22.35555943890167, sigma: 8.265434830225024 }],
      [
        { mu: 22.373451456616035, sigma: 8.258479912445537 },
        { mu: 22.373451456616035, sigma: 8.258479912445537 },
      ],
      [{ mu: 18.311159777900297, sigma: 8.219170401234347 }],
      [
        { mu: 18.364835831043397, sigma: 8.112716571808326 },
        { mu: 18.364835831043397, sigma: 8.112716571808326 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L334-L339
  it('scores', () => {
    const result = rate([[r], [r, r]], { model: plackettLuce, score: [1, 2] })
    expect(result).toStrictEqual([
      [{ mu: 19.4016459546452, sigma: 8.22447878583752 }],
      [
        { mu: 21.300857297585495, sigma: 8.179571171464575 },
        { mu: 21.300857297585495, sigma: 8.179571171464575 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L340-L348
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
        model: plackettLuce,
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
        { mu: 22.338487184593454, sigma: 8.306880153884078 },
        { mu: 24.32572274307156, sigma: 8.28178686186573 },
      ],
      [
        { mu: 20.599656070925114, sigma: 8.222674397835641 },
        { mu: 20.47545384852023, sigma: 8.277466291367071 },
      ],
      [
        { mu: 20.47545384852023, sigma: 8.277466291367071 },
        { mu: 20.599656070925114, sigma: 8.222674397835641 },
      ],
      [
        { mu: 20.599656070925114, sigma: 8.143190309869649 },
        { mu: 20.47545384852023, sigma: 8.23808444298095 },
      ],
      [
        { mu: 17.991409400422597, sigma: 8.23808444298095 },
        { mu: 19.171330513268973, sigma: 8.285123941326988 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L349-L357
  it('limit_sigma', () => {
    const result = rate([[r], [r, r], [r, r, r]], { model: plackettLuce, rank: [2, 1, 3], limitSigma: true })
    expect(result).toStrictEqual([
      [{ mu: 22.81664991565251, sigma: 8.28331609373364 }],
      [
        { mu: 22.74645120129216, sigma: 8.268148437657915 },
        { mu: 22.74645120129216, sigma: 8.268148437657915 },
      ],
      [
        { mu: 15.49065376140138, sigma: 8.18959307104567 },
        { mu: 15.49065376140138, sigma: 8.18959307104567 },
        { mu: 15.49065376140138, sigma: 8.18959307104567 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L358-L365
  it('ties', () => {
    const result = rate([[r], [r, r], [r, r, r]], { model: plackettLuce, rank: [1, 2, 1] })
    expect(result).toStrictEqual([
      [{ mu: 21.63766806988004, sigma: 8.310709773172306 }],
      [
        { mu: 19.53956360838512, sigma: 8.268148437657915 },
        { mu: 19.53956360838512, sigma: 8.268148437657915 },
      ],
      [
        { mu: 19.87652320008089, sigma: 8.237522411103104 },
        { mu: 19.87652320008089, sigma: 8.237522411103104 },
        { mu: 19.87652320008089, sigma: 8.237522411103104 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L366-L378
  it('weights', () => {
    const result = rate(
      [
        [r, r, r],
        [r, r],
        [r, r, r],
        [r, r],
      ],
      {
        model: plackettLuce,
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
        { mu: 21.649872897994697, sigma: 8.146110527078056 },
        { mu: 21.000562262055023, sigma: 8.239527864992827 },
        { mu: 21.000562262055023, sigma: 8.239527864992827 },
      ],
      [
        { mu: 22.456685723244924, sigma: 8.309959046469814 },
        { mu: 24.562119820374498, sigma: 8.28796214707792 },
      ],
      [
        { mu: 16.789694067795875, sigma: 8.195623892204544 },
        { mu: 16.789694067795875, sigma: 8.195623892204544 },
        { mu: 18.570472846955614, sigma: 8.264041781691587 },
      ],
      [
        { mu: 21.158064451365576, sigma: 8.249053790497177 },
        { mu: 21.964877276615802, sigma: 8.165369233562995 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L379-L386
  it('balance', () => {
    const result = rate(
      [
        [r, r],
        [r, r],
      ],
      { model: plackettLuce, rank: [1, 2], balance: true }
    )
    expect(result).toStrictEqual([
      [
        { mu: 22.31506119238646, sigma: 8.176156760223332 },
        { mu: 22.31506119238646, sigma: 8.176156760223332 },
      ],
      [
        { mu: 18.38744205984424, sigma: 8.176156760223332 },
        { mu: 18.38744205984424, sigma: 8.176156760223332 },
      ],
    ])
  })

  describe('weight_bounds', () => {
    const d = { mu: 25, sigma: 25 / 3 }

    // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L585-L590
    it('defaults to [1, 2]', () => {
      const teams = [
        [d, d, d],
        [d, d, d],
      ]
      const weight = [
        [0.5, 1, 2],
        [1, 1, 1],
      ]
      expect(rate(teams, { model: plackettLuce, rank: [1, 2], weight })).toStrictEqual(
        rate(teams, { model: plackettLuce, rank: [1, 2], weight, weightBounds: [1, 2] })
      )
    })

    // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L593-L620
    it('narrower bounds shrink the within-team spread', () => {
      const teams = [
        [d, d, d],
        [d, d, d],
      ]
      const weight = [
        [0.5, 1, 2],
        [1, 1, 1],
      ]
      const wide = rate(teams, { model: plackettLuce, rank: [1, 2], weight, weightBounds: [1, 2] })
      const narrow = rate(teams, { model: plackettLuce, rank: [1, 2], weight, weightBounds: [0.9, 1.1] })
      expect(narrow[0][2].mu - narrow[0][0].mu).toBeLessThan(wide[0][2].mu - wide[0][0].mu)
    })

    // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L623-L640
    it('weightBounds: null applies raw weights (uniform => equal updates)', () => {
      const result = rate(
        [
          [d, d, d],
          [d, d, d],
        ],
        {
          model: plackettLuce,
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
