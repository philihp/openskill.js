import { describe, it, expect } from '#test-helpers'
import { rate as rateGame, rating } from '../..'
import rate from '../thurstone-mosteller-part'

describe('thurstoneMostellerPart', () => {
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]
  const team3 = [r, r, r]

  it('solo game does not change rating', () => {
    expect.assertions(1)
    expect(rate([team1])).toStrictEqual([team1])
  })

  it('2p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1])).toStrictEqual([
      [{ mu: 27.10898076650337, sigma: 8.24891482617727 }],
      [{ mu: 22.89101923349663, sigma: 8.24891482617727 }],
    ])
  })

  it('3p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1])).toStrictEqual([
      [{ mu: 27.10898076650337, sigma: 8.24891482617727 }],
      [{ mu: 25, sigma: 8.24891482617727 }],
      [{ mu: 22.89101923349663, sigma: 8.24891482617727 }],
    ])
  })

  it('4p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.10898076650337, sigma: 8.24891482617727 }],
      [{ mu: 25.702993588834456, sigma: 8.24891482617727 }],
      [{ mu: 24.297006411165544, sigma: 8.24891482617727 }],
      [{ mu: 22.89101923349663, sigma: 8.24891482617727 }],
    ])
  })

  it('5p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.10898076650337, sigma: 8.24891482617727 }],
      [{ mu: 26.054490383251686, sigma: 8.24891482617727 }],
      [{ mu: 25, sigma: 8.24891482617727 }],
      [{ mu: 23.945509616748314, sigma: 8.24891482617727 }],
      [{ mu: 22.89101923349663, sigma: 8.24891482617727 }],
    ])
  })

  it('3 teams different sized players', () => {
    expect.assertions(1)
    expect(rate([team3, team1, team2])).toStrictEqual([
      [
        { mu: 25.549180529575406, sigma: 8.304762165041671 },
        { mu: 25.549180529575406, sigma: 8.304762165041671 },
        { mu: 25.549180529575406, sigma: 8.304762165041671 },
      ],
      [{ mu: 26.369901713689508, sigma: 8.295505032745819 }],
      [
        { mu: 23.080917756735086, sigma: 8.275871005496095 },
        { mu: 23.080917756735086, sigma: 8.275871005496095 },
      ],
    ])
  })

  it('can use a custom gamma with k=2', () => {
    expect.assertions(1)
    expect(rate([team1, team1], { gamma: (_, k) => 1 / k })).toStrictEqual([
      [{ mu: 27.10898076650337, sigma: 8.199456653433591 }],
      [{ mu: 22.89101923349663, sigma: 8.199456653433591 }],
    ])
  })

  it('can use a custom gamma with k=5', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1, team1], { gamma: (_, k) => 1 / k })).toStrictEqual([
      [{ mu: 27.10898076650337, sigma: 8.280042417239251 }],
      [{ mu: 26.054490383251686, sigma: 8.280042417239251 }],
      [{ mu: 25, sigma: 8.280042417239251 }],
      [{ mu: 23.945509616748314, sigma: 8.280042417239251 }],
      [{ mu: 22.89101923349663, sigma: 8.280042417239251 }],
    ])
  })

  describe('windowSize', () => {
    const ffa = (n: number) => Array.from({ length: n }, () => team1)

    it('defaults to 4', () => {
      expect(rate(ffa(7))).toStrictEqual(rate(ffa(7), { windowSize: 4 }))
    })

    it('window of 1 compares only adjacent teams', () => {
      const [first] = rate(ffa(5), { windowSize: 1 })
      expect(first).toStrictEqual(rate(ffa(2))[0])
    })

    it('window as wide as the game compares every pair', () => {
      expect(rate(ffa(5), { windowSize: 4 })).toStrictEqual(rate(ffa(5), { windowSize: Infinity }))
    })

    it('wider window reaches further teams', () => {
      // with a window of 4, team 1 of 7 sees one loss and four wins; with 6 it
      // sees one more win, so its average update is larger
      expect(rate(ffa(7))[1][0].mu).toBeLessThan(rate(ffa(7), { windowSize: 6 })[1][0].mu)
    })

    it('window of 0 leaves every rating unchanged', () => {
      expect(rate(ffa(3), { windowSize: 0 })).toStrictEqual(ffa(3))
    })

    it('gives tied teams the same update when the window covers the game', () => {
      const [, [b], [c]] = rate(ffa(3), { rank: [1, 2, 2] })
      expect(b).toStrictEqual(c)
    })

    it('does not depend on the order of tied teams when the window covers the game', () => {
      const a = rating()
      const b = rating({ mu: 30 })
      const c = rating({ mu: 20 })
      const [, [bFirst]] = rateGame([[a], [b], [c]], { model: rate, score: [9, 7, 7] })
      const [, , [bLast]] = rateGame([[a], [c], [b]], { model: rate, score: [9, 7, 7] })
      expect(bFirst).toStrictEqual(bLast)
    })
  })
})
