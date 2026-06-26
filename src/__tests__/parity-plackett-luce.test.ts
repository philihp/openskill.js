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
      expect(rate(teams, { model: plackettLuce, rank: [1, 2], weight })).toStrictEqual(
        rate(teams, { model: plackettLuce, rank: [1, 2], weight, weightBounds: [1, 2] })
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
      const wide = rate(teams, { model: plackettLuce, rank: [1, 2], weight, weightBounds: [1, 2] })
      const narrow = rate(teams, { model: plackettLuce, rank: [1, 2], weight, weightBounds: [0.9, 1.1] })
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

describe('PlackettLuce single-match & tournament parity (openskill.py)', () => {
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

    const result = rate(inputs, { rank: [1, 2] })

    expect(result).toStrictEqual([
      [
        { mu: 29.607340941337068, sigma: 4.755311788972862 },
        { mu: 27.624602782532037, sigma: 4.892807828777459 },
      ],
      [
        { mu: 15.953170429143093, sigma: 6.125902065139878 },
        { mu: 23.70858117648013, sigma: 8.111707446126035 },
      ],
    ])
  })

  it('matches Python for a four-way free-for-all at default hyperparameters', () => {
    const inputs = [
      [{ mu: 29.182, sigma: 4.782 }],
      [{ mu: 27.174, sigma: 4.922 }],
      [{ mu: 16.672, sigma: 6.217 }],
      [{ mu: 25.0, sigma: 25 / 3 }],
    ]

    const result = rate(inputs)

    expect(result).toStrictEqual([
      [{ mu: 30.210227447000438, sigma: 4.765617924939384 }],
      [{ mu: 27.644725221915632, sigma: 4.883479590134575 }],
      [{ mu: 17.4036218889969, sigma: 6.101259408259549 }],
      [{ mu: 19.21460876538932, sigma: 7.854669920480409 }],
    ])
  })

  it('matches Python for a 16-match doubles tournament with non-default mu/sigma', () => {
    const matches = [
      { teamA: [1, 0], teamB: [5, 2], ranks: [2, 1] },
      { teamA: [3, 1], teamB: [6, 0], ranks: [2, 1] },
      { teamA: [1, 4], teamB: [3, 0], ranks: [2, 1] },
      { teamA: [0, 7], teamB: [1, 5], ranks: [1, 2] },
      { teamA: [0, 4], teamB: [1, 6], ranks: [1, 2] },
      { teamA: [6, 1], teamB: [3, 4], ranks: [2, 1] },
      { teamA: [4, 6], teamB: [0, 1], ranks: [1, 2] },
      { teamA: [6, 2], teamB: [7, 1], ranks: [1, 2] },
      { teamA: [3, 6], teamB: [2, 0], ranks: [2, 1] },
      { teamA: [1, 3], teamB: [0, 2], ranks: [2, 1] },
      { teamA: [5, 4], teamB: [2, 0], ranks: [2, 1] },
      { teamA: [7, 4], teamB: [0, 3], ranks: [2, 1] },
      { teamA: [1, 4], teamB: [2, 6], ranks: [2, 1] },
      { teamA: [5, 4], teamB: [1, 0], ranks: [1, 2] },
      { teamA: [0, 5], teamB: [1, 2], ranks: [1, 2] },
      { teamA: [1, 6], teamB: [7, 0], ranks: [2, 1] },
    ]
    const numPlayers = 8
    const ratings = Array.from({ length: numPlayers }, () => ({ mu: 0.0, sigma: 1.0 }))

    for (const m of matches) {
      const teamA = m.teamA.map((id) => ratings[id])
      const teamB = m.teamB.map((id) => ratings[id])
      const updated = rate([teamA, teamB], { rank: m.ranks, mu: 0.0, sigma: 1.0 })
      m.teamA.forEach((id, i) => {
        ratings[id] = updated[0][i]
      })
      m.teamB.forEach((id, i) => {
        ratings[id] = updated[1][i]
      })
    }

    expect(ratings).toStrictEqual([
      { mu: 0.5567026846130032, sigma: 1.034158775793176 },
      { mu: -1.040809215541878, sigma: 1.0341609940620864 },
      { mu: 0.39069662848779696, sigma: 1.018714971172244 },
      { mu: 0.00418100716362646, sigma: 1.0160852090650665 },
      { mu: 0.004454102509053343, sigma: 1.0213323603679194 },
      { mu: 0.08064393443147759, sigma: 1.0134445163810648 },
      { mu: 0.0008019558612562538, sigma: 1.0213325142564154 },
      { mu: -0.004756003021986366, sigma: 1.0107885446332125 },
    ])
  })
})
