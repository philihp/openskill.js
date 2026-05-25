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
      [{ mu: 25.0, sigma: 7.788474807872566 }],
      [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
    ])
  })

  it('4p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
      [{ mu: 25.0, sigma: 7.788474807872566 }],
      [{ mu: 25.0, sigma: 7.788474807872566 }],
      [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
    ])
  })

  it('5p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
      [{ mu: 25.0, sigma: 7.788474807872566 }],
      [{ mu: 25.0, sigma: 7.788474807872566 }],
      [{ mu: 25.0, sigma: 7.788474807872566 }],
      [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
    ])
  })

  it('3 teams different sized players', () => {
    expect.assertions(1)
    expect(rate([team3, team1, team2])).toStrictEqual([
      [
        { mu: 25.219231461891965, sigma: 8.293401112661954 },
        { mu: 25.219231461891965, sigma: 8.293401112661954 },
        { mu: 25.219231461891965, sigma: 8.293401112661954 },
      ],
      [{ mu: 28.48909130001799, sigma: 8.220848339985736 }],
      [
        { mu: 21.291677238090045, sigma: 8.206896387427937 },
        { mu: 21.291677238090045, sigma: 8.206896387427937 },
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
      [{ mu: 25, sigma: 8.16496580927726 }],
      [{ mu: 25, sigma: 8.16496580927726 }],
      [{ mu: 25, sigma: 8.16496580927726 }],
      [{ mu: 22.36476861652635, sigma: 8.249579113843055 }],
    ])
  })
})

describe('bradleyTerryPart margin', () => {
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
      [{ mu: 32.732190491527874, sigma: 4.931311782257958 }],
      [{ mu: 16.94564569219986, sigma: 5.8568385167554675 }],
    ])
  })
})
