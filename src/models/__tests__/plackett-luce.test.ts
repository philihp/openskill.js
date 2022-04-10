import { rating } from '../..'
import rate from '../plackett-luce'

describe('plackettLuce', () => {
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
      [{ mu: 27.868876552746237, sigma: 8.204837030780652 }],
      [{ mu: 25.717219138186557, sigma: 8.057829747583874 }],
      [{ mu: 21.413904309067206, sigma: 8.057829747583874 }],
    ])
  })

  it('4p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.795084971874736, sigma: 8.263160757613477 }],
      [{ mu: 26.552824984374855, sigma: 8.179213704945203 }],
      [{ mu: 24.68943500312503, sigma: 8.083731307186588 }],
      [{ mu: 20.96265504062538, sigma: 8.083731307186588 }],
    ])
  })

  it('5p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.666666666666668, sigma: 8.290556877154474 }],
      [{ mu: 26.833333333333332, sigma: 8.240145629781066 }],
      [{ mu: 25.72222222222222, sigma: 8.179996679645559 }],
      [{ mu: 24.055555555555557, sigma: 8.111796013701358 }],
      [{ mu: 20.72222222222222, sigma: 8.111796013701358 }],
    ])
  })

  it('3 teams different sized players', () => {
    expect.assertions(1)
    expect(rate([team3, team1, team2])).toStrictEqual([
      [
        { mu: 25.939870821784513, sigma: 8.247641552260456 },
        { mu: 25.939870821784513, sigma: 8.247641552260456 },
        { mu: 25.939870821784513, sigma: 8.247641552260456 },
      ],
      [{ mu: 27.21366020491262, sigma: 8.274321317985242 }],
      [
        { mu: 21.84646897330287, sigma: 8.213058173195341 },
        { mu: 21.84646897330287, sigma: 8.213058173195341 },
      ],
    ])
  })
})
