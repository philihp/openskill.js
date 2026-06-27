import { describe, it, expect } from '#test-helpers'
import { rate } from '..'
import thurstoneMostellerPart from '../models/thurstone-mosteller-part'

// Parity with openskill.py 6.2.0's test_thurstone_mosteller_part.py::test_rate, asserted against
// the exact constants from its fixture (tests/models/data/thurstonemostellerpart.json).
// Every player starts at the model's (mu, sigma), so a team is just a count of r.
// https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_thurstone_mosteller_part.py#L317-L417
//
// margins and (for the part models) 3+-team games are KNOWN DIVERGENCES from
// openskill.py 6.2.0, kept here with the upstream constants but skipped:
//   - margins: openskill.js scales the margin post-hoc in rate.ts; openskill.py
//     folds it into the model.
//   - part models on 3+ teams: openskill.js pairs adjacent teams (ladderPairs);
//     openskill.py rewrote them around a sliding window_size (default 4).

describe('ThurstoneMostellerPart parity with openskill.py 6.2.0', () => {
  const r = { mu: 26.469640334617008, sigma: 7.974532802151592 }

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_thurstone_mosteller_part.py#L334-L338
  it('normal', () => {
    const result = rate([[r], [r, r]], { model: thurstoneMostellerPart })
    expect(result).toStrictEqual([
      [{ mu: 29.50521154123705, sigma: 7.916012842128793 }],
      [
        { mu: 23.434069127996967, sigma: 7.891463730090605 },
        { mu: 23.434069127996967, sigma: 7.891463730090605 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_thurstone_mosteller_part.py#L339-L348
  it.skip('ranks [KNOWN DIVERGENCE: part model pairs only adjacent teams; openskill.py uses a sliding window]', () => {
    const result = rate([[r], [r, r], [r], [r, r]], { model: thurstoneMostellerPart, rank: [2, 1, 4, 3] })
    expect(result).toStrictEqual([
      [{ mu: 27.91178106308775, sigma: 7.9190101914124975 }],
      [
        { mu: 27.441111340399758, sigma: 7.930801109129218 },
        { mu: 27.441111340399758, sigma: 7.930801109129218 },
      ],
      [{ mu: 25.33000132176046, sigma: 7.928540160592034 }],
      [
        { mu: 25.195667613220063, sigma: 7.9173241864045165 },
        { mu: 25.195667613220063, sigma: 7.9173241864045165 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_thurstone_mosteller_part.py#L349-L354
  it('scores', () => {
    const result = rate([[r], [r, r]], { model: thurstoneMostellerPart, score: [1, 2] })
    expect(result).toStrictEqual([
      [{ mu: 25.760284981357852, sigma: 7.944579240968348 }],
      [
        { mu: 27.178995687876164, sigma: 7.931957619853589 },
        { mu: 27.178995687876164, sigma: 7.931957619853589 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_thurstone_mosteller_part.py#L355-L363
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
        model: thurstoneMostellerPart,
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
        { mu: 27.96534264544695, sigma: 7.928487581587607 },
        { mu: 29.461044956276893, sigma: 7.881732855517346 },
      ],
      [
        { mu: 27.21749149003198, sigma: 7.868375374287526 },
        { mu: 26.843565912324493, sigma: 7.921851074330119 },
      ],
      [
        { mu: 26.843565912324493, sigma: 7.921851074330119 },
        { mu: 27.21749149003198, sigma: 7.868375374287526 },
      ],
      [
        { mu: 26.095714756909523, sigma: 7.951761854722042 },
        { mu: 25.721789179202037, sigma: 7.928487581587607 },
      ],
      [
        { mu: 24.973938023787067, sigma: 7.928487581587607 },
        { mu: 25.721789179202037, sigma: 7.951761854722042 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_thurstone_mosteller_part.py#L364-L372
  it.skip('limit_sigma [KNOWN DIVERGENCE: part model pairs only adjacent teams; openskill.py uses a sliding window]', () => {
    const result = rate([[r], [r, r], [r, r, r]], { model: thurstoneMostellerPart, rank: [2, 1, 3], limitSigma: true })
    expect(result).toStrictEqual([
      [{ mu: 27.975386377266542, sigma: 7.9377235327380635 }],
      [
        { mu: 27.921611900458238, sigma: 7.932817201096874 },
        { mu: 27.921611900458238, sigma: 7.932817201096874 },
      ],
      [
        { mu: 23.511922726126244, sigma: 7.911402997928463 },
        { mu: 23.511922726126244, sigma: 7.911402997928463 },
        { mu: 23.511922726126244, sigma: 7.911402997928463 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_thurstone_mosteller_part.py#L373-L380
  it.skip('ties [KNOWN DIVERGENCE: part model pairs only adjacent teams; openskill.py uses a sliding window]', () => {
    const result = rate([[r], [r, r], [r, r, r]], { model: thurstoneMostellerPart, rank: [1, 2, 1] })
    expect(result).toStrictEqual([
      [{ mu: 29.44309461220982, sigma: 7.919695615857688 }],
      [
        { mu: 24.603904695758974, sigma: 7.9209068622595575 },
        { mu: 24.603904695758974, sigma: 7.9209068622595575 },
      ],
      [
        { mu: 25.361921695882234, sigma: 7.91508954685688 },
        { mu: 25.361921695882234, sigma: 7.91508954685688 },
        { mu: 25.361921695882234, sigma: 7.91508954685688 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_thurstone_mosteller_part.py#L381-L393
  it.skip('weights [KNOWN DIVERGENCE: part model pairs only adjacent teams; openskill.py uses a sliding window]', () => {
    const result = rate(
      [
        [r, r, r],
        [r, r],
        [r, r, r],
        [r, r],
      ],
      {
        model: thurstoneMostellerPart,
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
        { mu: 26.427517800681336, sigma: 7.956025338955594 },
        { mu: 26.385395266745665, sigma: 7.937037264065903 },
        { mu: 26.385395266745665, sigma: 7.937037264065903 },
      ],
      [
        { mu: 28.431266290509193, sigma: 7.931947363860401 },
        { mu: 30.392892246401377, sigma: 7.888691913686816 },
      ],
      [
        { mu: 24.59126431443039, sigma: 7.930267851061856 },
        { mu: 24.59126431443039, sigma: 7.930267851061856 },
        { mu: 25.530452324523697, sigma: 7.952649434201831 },
      ],
      [
        { mu: 26.470635466782785, sigma: 7.937473829418651 },
        { mu: 26.471630598948565, sigma: 7.8998014993021055 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_thurstone_mosteller_part.py#L394-L401
  it('balance', () => {
    const result = rate(
      [
        [r, r],
        [r, r],
      ],
      { model: thurstoneMostellerPart, rank: [1, 2], balance: true }
    )
    expect(result).toStrictEqual([
      [
        { mu: 27.96534264544695, sigma: 7.928487581587607 },
        { mu: 27.96534264544695, sigma: 7.928487581587607 },
      ],
      [
        { mu: 24.973938023787067, sigma: 7.928487581587607 },
        { mu: 24.973938023787067, sigma: 7.928487581587607 },
      ],
    ])
  })

  describe('weight_bounds', () => {
    const d = { mu: 25, sigma: 25 / 3 }

    // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_thurstone_mosteller_part.py#L615-L620
    it('defaults to [1, 2]', () => {
      const teams = [
        [d, d, d],
        [d, d, d],
      ]
      const weight = [
        [0.5, 1, 2],
        [1, 1, 1],
      ]
      expect(rate(teams, { model: thurstoneMostellerPart, rank: [1, 2], weight })).toStrictEqual(
        rate(teams, { model: thurstoneMostellerPart, rank: [1, 2], weight, weightBounds: [1, 2] })
      )
    })

    // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_thurstone_mosteller_part.py#L623-L647
    it('narrower bounds shrink the within-team spread', () => {
      const teams = [
        [d, d, d],
        [d, d, d],
      ]
      const weight = [
        [0.5, 1, 2],
        [1, 1, 1],
      ]
      const wide = rate(teams, { model: thurstoneMostellerPart, rank: [1, 2], weight, weightBounds: [1, 2] })
      const narrow = rate(teams, { model: thurstoneMostellerPart, rank: [1, 2], weight, weightBounds: [0.9, 1.1] })
      expect(narrow[0][2].mu - narrow[0][0].mu).toBeLessThan(wide[0][2].mu - wide[0][0].mu)
    })

    // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_thurstone_mosteller_part.py#L650-L665
    it('weightBounds: null applies raw weights (uniform => equal updates)', () => {
      const result = rate(
        [
          [d, d, d],
          [d, d, d],
        ],
        {
          model: thurstoneMostellerPart,
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
