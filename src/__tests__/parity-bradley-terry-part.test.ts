import { describe, it, expect } from '#test-helpers'
import { rate } from '..'
import bradleyTerryPart from '../models/bradley-terry-part'

// Parity with openskill.py 6.2.0's test_bradley_terry_part.py::test_rate, asserted against
// the exact constants from its fixture (tests/models/data/bradleyterrypart.json).
// Every player starts at the model's (mu, sigma), so a team is just a count of r.
// https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_part.py#L309-L409
//
// margins and (for the part models) 3+-team games are KNOWN DIVERGENCES from
// openskill.py 6.2.0, kept here with the upstream constants but skipped:
//   - margins: openskill.js scales the margin post-hoc in rate.ts; openskill.py
//     folds it into the model.
//   - part models on 3+ teams: openskill.js pairs adjacent teams (ladderPairs);
//     openskill.py rewrote them around a sliding window_size (default 4).

describe('BradleyTerryPart parity with openskill.py 6.2.0', () => {
  const r = { mu: 8.954715133403496, sigma: 5.848503823078021 }

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_part.py#L326-L330
  it('normal', () => {
    const result = rate([[r], [r, r]], { model: bradleyTerryPart })
    expect(result).toStrictEqual([
      [{ mu: 10.946230734590799, sigma: 5.769748517601138 }],
      [
        { mu: 6.963199532216194, sigma: 5.73655963735044 },
        { mu: 6.963199532216194, sigma: 5.73655963735044 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_part.py#L331-L340
  it.skip('ranks [KNOWN DIVERGENCE: part model pairs only adjacent teams; openskill.py uses a sliding window]', () => {
    const result = rate([[r], [r, r], [r], [r, r]], { model: bradleyTerryPart, rank: [2, 1, 4, 3] })
    expect(result).toStrictEqual([
      [{ mu: 9.870790808603847, sigma: 5.749148172476351 }],
      [
        { mu: 10.008429504961542, sigma: 5.743144340247091 },
        { mu: 10.008429504961542, sigma: 5.743144340247091 },
      ],
      [{ mu: 7.774882207356119, sigma: 5.749148172476351 }],
      [
        { mu: 8.164758012692479, sigma: 5.743144340247091 },
        { mu: 8.164758012692479, sigma: 5.743144340247091 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_part.py#L341-L346
  it('scores', () => {
    const result = rate([[r], [r, r]], { model: bradleyTerryPart, score: [1, 2] })
    expect(result).toStrictEqual([
      [{ mu: 8.02711934882737, sigma: 5.769748517601138 }],
      [
        { mu: 9.882310917979623, sigma: 5.73655963735044 },
        { mu: 9.882310917979623, sigma: 5.73655963735044 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_part.py#L347-L355
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
        model: bradleyTerryPart,
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
        { mu: 10.260666678925377, sigma: 5.756291149080297 },
        { mu: 11.566618224447257, sigma: 5.6619638088703494 },
      ],
      [
        { mu: 9.607690906164436, sigma: 5.6619638088703494 },
        { mu: 9.281203019783966, sigma: 5.756291149080297 },
      ],
      [
        { mu: 9.281203019783966, sigma: 5.756291149080297 },
        { mu: 9.607690906164436, sigma: 5.6619638088703494 },
      ],
      [
        { mu: 8.628227247023027, sigma: 5.80287985426128 },
        { mu: 8.301739360642557, sigma: 5.756291149080297 },
      ],
      [
        { mu: 7.648763587881616, sigma: 5.756291149080297 },
        { mu: 8.301739360642557, sigma: 5.80287985426128 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_part.py#L356-L364
  it.skip('limit_sigma [KNOWN DIVERGENCE: part model pairs only adjacent teams; openskill.py uses a sliding window]', () => {
    const result = rate([[r], [r, r], [r, r, r]], { model: bradleyTerryPart, rank: [2, 1, 3], limitSigma: true })
    expect(result).toStrictEqual([
      [{ mu: 9.53168513913054, sigma: 5.788305447884618 }],
      [
        { mu: 10.195020992403235, sigma: 5.7608622734328305 },
        { mu: 10.195020992403235, sigma: 5.7608622734328305 },
      ],
      [
        { mu: 7.137439268676715, sigma: 5.773109870367607 },
        { mu: 7.137439268676715, sigma: 5.773109870367607 },
        { mu: 7.137439268676715, sigma: 5.773109870367607 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_part.py#L365-L372
  it.skip('ties [KNOWN DIVERGENCE: part model pairs only adjacent teams; openskill.py uses a sliding window]', () => {
    const result = rate([[r], [r, r], [r, r, r]], { model: bradleyTerryPart, rank: [1, 2, 1] })
    expect(result).toStrictEqual([
      [{ mu: 10.338265059251315, sigma: 5.788305447884618 }],
      [
        { mu: 7.543004512196137, sigma: 5.7608622734328305 },
        { mu: 7.543004512196137, sigma: 5.7608622734328305 },
      ],
      [
        { mu: 8.982875828763039, sigma: 5.773109870367607 },
        { mu: 8.982875828763039, sigma: 5.773109870367607 },
        { mu: 8.982875828763039, sigma: 5.773109870367607 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_part.py#L373-L385
  it.skip('weights [KNOWN DIVERGENCE: part model pairs only adjacent teams; openskill.py uses a sliding window]', () => {
    const result = rate(
      [
        [r, r, r],
        [r, r],
        [r, r, r],
        [r, r],
      ],
      {
        model: bradleyTerryPart,
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
        { mu: 9.210108112704093, sigma: 5.697702786410324 },
        { mu: 9.082411623053794, sigma: 5.773896364469605 },
        { mu: 9.082411623053794, sigma: 5.773896364469605 },
      ],
      [
        { mu: 10.42537627085969, sigma: 5.7754881866116 },
        { mu: 11.896037408315884, sigma: 5.700928536157741 },
      ],
      [
        { mu: 7.551304590738987, sigma: 5.773896364469605 },
        { mu: 7.551304590738987, sigma: 5.773896364469605 },
        { mu: 8.253009862071242, sigma: 5.8116185628720505 },
      ],
      [
        { mu: 8.759768048961513, sigma: 5.7754881866116 },
        { mu: 8.857241591182506, sigma: 5.812409363022052 },
      ],
    ])
  })

  // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_part.py#L386-L393
  it('balance', () => {
    const result = rate(
      [
        [r, r],
        [r, r],
      ],
      { model: bradleyTerryPart, rank: [1, 2], balance: true }
    )
    expect(result).toStrictEqual([
      [
        { mu: 10.260666678925377, sigma: 5.756291149080297 },
        { mu: 10.260666678925377, sigma: 5.756291149080297 },
      ],
      [
        { mu: 7.648763587881616, sigma: 5.756291149080297 },
        { mu: 7.648763587881616, sigma: 5.756291149080297 },
      ],
    ])
  })

  describe('weight_bounds', () => {
    const d = { mu: 25, sigma: 25 / 3 }

    // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_part.py#L607-L612
    it('defaults to [1, 2]', () => {
      const teams = [
        [d, d, d],
        [d, d, d],
      ]
      const weight = [
        [0.5, 1, 2],
        [1, 1, 1],
      ]
      expect(rate(teams, { model: bradleyTerryPart, rank: [1, 2], weight })).toStrictEqual(
        rate(teams, { model: bradleyTerryPart, rank: [1, 2], weight, weightBounds: [1, 2] })
      )
    })

    // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_part.py#L615-L639
    it('narrower bounds shrink the within-team spread', () => {
      const teams = [
        [d, d, d],
        [d, d, d],
      ]
      const weight = [
        [0.5, 1, 2],
        [1, 1, 1],
      ]
      const wide = rate(teams, { model: bradleyTerryPart, rank: [1, 2], weight, weightBounds: [1, 2] })
      const narrow = rate(teams, { model: bradleyTerryPart, rank: [1, 2], weight, weightBounds: [0.9, 1.1] })
      expect(narrow[0][2].mu - narrow[0][0].mu).toBeLessThan(wide[0][2].mu - wide[0][0].mu)
    })

    // https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_bradley_terry_part.py#L642-L657
    it('weightBounds: null applies raw weights (uniform => equal updates)', () => {
      const result = rate(
        [
          [d, d, d],
          [d, d, d],
        ],
        {
          model: bradleyTerryPart,
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
