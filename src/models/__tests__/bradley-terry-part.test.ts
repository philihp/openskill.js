import { describe, it, expect } from '#test-helpers'
import { rating } from '../..'
import { Gamma } from '../../types'
import rate from '../bradley-terry-part'

describe('bradleyTerryPart', () => {
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
      [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
      [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
    ])
  })

  it('3p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1])).toStrictEqual([
      [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
      [{ mu: 25, sigma: 8.065506316323548 }],
      [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
    ])
  })

  it('4p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
      [{ mu: 25.878410461157884, sigma: 8.065506316323548 }],
      [{ mu: 24.121589538842116, sigma: 8.065506316323548 }],
      [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
    ])
  })

  it('5p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
      [{ mu: 26.317615691736826, sigma: 8.065506316323548 }],
      [{ mu: 25, sigma: 8.065506316323548 }],
      [{ mu: 23.682384308263174, sigma: 8.065506316323548 }],
      [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
    ])
  })

  it('3 teams different sized players', () => {
    expect.assertions(1)
    expect(rate([team3, team1, team2])).toStrictEqual([
      [
        { mu: 25.49637195758965, sigma: 8.265497336607986 },
        { mu: 25.49637195758965, sigma: 8.265497336607986 },
        { mu: 25.49637195758965, sigma: 8.265497336607986 },
      ],
      [{ mu: 26.744545650008995, sigma: 8.27728191719633 }],
      [
        { mu: 22.759082392401357, sigma: 8.231067733994585 },
        { mu: 22.759082392401357, sigma: 8.231067733994585 },
      ],
    ])
  })

  it('can use a custom gamma with k=2', () => {
    expect.assertions(1)
    const gamma: Gamma = (_, k) => 1 / k
    expect(rate([team1, team1], { gamma })).toStrictEqual([
      [{ mu: 27.63523138347365, sigma: 8.122328620674137 }],
      [{ mu: 22.36476861652635, sigma: 8.122328620674137 }],
    ])
  })

  it('can use a custom gamma with k=5', () => {
    expect.assertions(1)
    const gamma: Gamma = (_, k) => 1 / k
    expect(rate([team1, team1, team1, team1, team1], { gamma })).toStrictEqual([
      [{ mu: 27.63523138347365, sigma: 8.249579113843055 }],
      [{ mu: 26.317615691736826, sigma: 8.249579113843055 }],
      [{ mu: 25, sigma: 8.249579113843055 }],
      [{ mu: 23.682384308263174, sigma: 8.249579113843055 }],
      [{ mu: 22.36476861652635, sigma: 8.249579113843055 }],
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
  })
})
