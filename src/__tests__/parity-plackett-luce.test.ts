import { describe, it, expect } from '#test-helpers'
import { rate } from '..'

// These expected values are produced by the current openskill.js implementation.
// They are verified against openskill==6.2.0 (Python) as exact fixtures.

describe('Plackett-Luce parity with openskill.py 6.x', () => {
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
        { mu: 29.607218266047376, sigma: 4.754597315295896 },
        { mu: 27.624480490655575, sigma: 4.89211428863373 },
      ],
      [
        { mu: 15.953288649990139, sigma: 6.125357588584119 },
        { mu: 23.708690706816785, sigma: 8.111298027437888 },
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
      [{ mu: 30.209971908310553, sigma: 4.764898977359521 }],
      [{ mu: 27.64460833689499, sigma: 4.882789305097372 }],
      [{ mu: 17.403586731283518, sigma: 6.100723440599442 }],
      [{ mu: 19.214790707434826, sigma: 7.8542613981643985 }],
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
      { mu: 0.5302751308020349, sigma: 0.990623111063428 },
      { mu: -0.9963717976009021, sigma: 0.9906305440838667 },
      { mu: 0.38418104872599157, sigma: 0.9949243033579382 },
      { mu: 0.0034391822654418064, sigma: 0.9956353749349331 },
      { mu: 0.005017596505349636, sigma: 0.9941908121730851 },
      { mu: 0.07841118689686208, sigma: 0.9963564941705253 },
      { mu: 0.0016091404814552457, sigma: 0.9942002173835557 },
      { mu: -0.004380171242698266, sigma: 0.9970887868201247 },
    ])
  })
})
