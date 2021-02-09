import { rating } from '../..'
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
})
