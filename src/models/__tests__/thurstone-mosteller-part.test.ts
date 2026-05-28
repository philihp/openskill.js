import { describe, it, expect } from '#test-helpers'
import { rating } from '../..'
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
      [{ mu: 25, sigma: 8.163623409651494 }],
      [{ mu: 22.89101923349663, sigma: 8.24891482617727 }],
    ])
  })

  it('4p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.10898076650337, sigma: 8.24891482617727 }],
      [{ mu: 25, sigma: 8.163623409651494 }],
      [{ mu: 25, sigma: 8.163623409651494 }],
      [{ mu: 22.89101923349663, sigma: 8.24891482617727 }],
    ])
  })

  it('5p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.10898076650337, sigma: 8.24891482617727 }],
      [{ mu: 25, sigma: 8.163623409651494 }],
      [{ mu: 25, sigma: 8.163623409651494 }],
      [{ mu: 25, sigma: 8.163623409651494 }],
      [{ mu: 22.89101923349663, sigma: 8.24891482617727 }],
    ])
  })

  it('3 teams different sized players', () => {
    expect.assertions(1)
    expect(rate([team3, team1, team2])).toStrictEqual([
      [
        { mu: 25.314271358583422, sigma: 8.309539398724164 },
        { mu: 25.314271358583422, sigma: 8.309539398724164 },
        { mu: 25.314271358583422, sigma: 8.309539398724164 },
      ],
      [{ mu: 27.739803427379016, sigma: 8.25750343942877 }],
      [
        { mu: 21.94592521403756, sigma: 8.245518834730671 },
        { mu: 21.94592521403756, sigma: 8.245518834730671 },
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
      [{ mu: 25, sigma: 8.226406288174564 }],
      [{ mu: 25, sigma: 8.226406288174564 }],
      [{ mu: 25, sigma: 8.226406288174564 }],
      [{ mu: 22.89101923349663, sigma: 8.280042417239251 }],
    ])
  })
})

describe('thurstoneMostellerPart margin', () => {
  const w = rating({ mu: 32, sigma: 5 })
  const l = rating({ mu: 18, sigma: 6 })

  it('zero margin with score equals rank-only', () => {
    expect(rate([[w], [l]], { score: [20, 1], margin: 0 })).toStrictEqual(rate([[w], [l]]))
  })

  it('no score with margin equals rank-only', () => {
    expect(rate([[w], [l]], { rank: [1, 2], margin: 10 })).toStrictEqual(rate([[w], [l]]))
  })

  it('narrow score below margin equals legacy', () => {
    expect(rate([[w], [l]], { score: [6, 1], margin: 5 })).toStrictEqual(rate([[w], [l]]))
  })

  it('blowout above margin differs from narrow', () => {
    const narrow = rate([[w], [l]], { score: [6, 1], margin: 5 })
    const blowout = rate([[w], [l]], { score: [20, 1], margin: 5 })
    expect(blowout).not.toStrictEqual(narrow)
  })

  it('blowout fixture', () => {
    expect(rate([[w], [l]], { score: [20, 1], margin: 5 })).toStrictEqual([
      [{ mu: 32.68309362408334, sigma: 4.977970527266478 }],
      [{ mu: 17.016345181319988, sigma: 5.954245863245213 }],
    ])
  })
})
