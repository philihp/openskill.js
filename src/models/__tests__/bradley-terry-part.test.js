import { rate as rateStub, rating } from '../..'

describe('bradleyTerryPart', () => {
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]
  const team3 = [r, r, r]

  const rate = (game) => rateStub(game, { model: 'bradleyTerryPart' })

  it('solo game does not change rating', () => {
    expect(rate([team1])).toEqual([team1])
  })

  it('2p FFA', () => {
    expect(rate([team1, team1])).toEqual([
      [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
      [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
    ])
  })

  it('3p FFA', () => {
    expect(rate([team1, team1, team1])).toEqual([
      [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
      [{ mu: 25.0, sigma: 7.788474807872566 }],
      [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
    ])
  })

  it('4p FFA', () => {
    expect(rate([team1, team1, team1, team1])).toEqual([
      [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
      [{ mu: 25.0, sigma: 7.788474807872566 }],
      [{ mu: 25.0, sigma: 7.788474807872566 }],
      [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
    ])
  })

  it('5p FFA', () => {
    expect(rate([team1, team1, team1, team1, team1])).toEqual([
      [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
      [{ mu: 25.0, sigma: 7.788474807872566 }],
      [{ mu: 25.0, sigma: 7.788474807872566 }],
      [{ mu: 25.0, sigma: 7.788474807872566 }],
      [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
    ])
  })

  it('3 teams different sized players', () => {
    expect(rate([team3, team1, team2])).toEqual([
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
