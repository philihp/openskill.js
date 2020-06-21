import { rate as rateStub, rating } from '../..'

describe('bradleyTerryFull', () => {
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]
  const team3 = [r, r, r]

  const rate = (game) => rateStub(game, { model: 'bradleyTerryFull' })

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
      [{ mu: 30.2704627669473, sigma: 7.788474807872566 }],
      [{ mu: 25.0, sigma: 7.788474807872566 }],
      [{ mu: 19.7295372330527, sigma: 7.788474807872566 }],
    ])
  })

  it('4p FFA', () => {
    expect(rate([team1, team1, team1, team1])).toEqual([
      [{ mu: 32.90569415042095, sigma: 7.5012190693964005 }],
      [{ mu: 27.63523138347365, sigma: 7.5012190693964005 }],
      [{ mu: 22.36476861652635, sigma: 7.5012190693964005 }],
      [{ mu: 17.09430584957905, sigma: 7.5012190693964005 }],
    ])
  })

  it('5p FFA', () => {
    expect(rate([team1, team1, team1, team1, team1])).toEqual([
      [{ mu: 35.5409255338946, sigma: 7.202515895247076 }],
      [{ mu: 30.2704627669473, sigma: 7.202515895247076 }],
      [{ mu: 25.0, sigma: 7.202515895247076 }],
      [{ mu: 19.729537233052703, sigma: 7.202515895247076 }],
      [{ mu: 14.4590744661054, sigma: 7.202515895247076 }],
    ])
  })

  it('3 teams different sized players', () => {
    expect(rate([team3, team1, team2])).toEqual([
      [
        { mu: 25.992743915179297, sigma: 8.19709997489984 },
        { mu: 25.992743915179297, sigma: 8.19709997489984 },
        { mu: 25.992743915179297, sigma: 8.19709997489984 },
      ],
      [{ mu: 28.48909130001799, sigma: 8.220848339985736 }],
      [
        { mu: 20.518164784802714, sigma: 8.127515465304823 },
        { mu: 20.518164784802714, sigma: 8.127515465304823 },
      ],
    ])
  })
})
