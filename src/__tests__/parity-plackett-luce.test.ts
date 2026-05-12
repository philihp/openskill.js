import { describe, it, expect } from '#test-helpers'
import { rate } from '..'

// These expected values are produced by openskill==6.2.0 (Python).
// See /tmp/openskill-compare/parity_fixtures.py for the script that
// generates them. Each scenario is bit-for-bit identical between the
// two libraries.

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
